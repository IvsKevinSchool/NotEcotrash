from rest_framework import viewsets
from apps.services.models import Status, TypeServices, Services, ServiceLog
from apps.management.models import Management
from apps.services.api.serializer import StatusSerializer, TypeServicesSerializer, ServicesSerializer, ServiceLogSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import subprocess
import os
import datetime
from rest_framework.views import APIView
from rest_framework import viewsets
from apps.services.models import Status, TypeServices, Services, ServiceLog
from apps.management.models import Management
from apps.services.api.serializer import StatusSerializer, TypeServicesSerializer, ServicesSerializer, ServiceLogSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import subprocess
import os
import psycopg2
import datetime
import csv
import glob
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class StatusViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Status instances.
    """
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class TypeServicesViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing TypeServices instances.
    Returns default services (IDs: 1, 2, 3) plus management-specific services.
    
    Query Parameters:
    - management_id (optional): Filter services by management ID. Returns basic services (IDs: 1,2,3) + management-specific services.
    """
    serializer_class = TypeServicesSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    
    def get_queryset(self):
        """
        Retorna los servicios básicos (IDs: 1, 2, 3) más los servicios específicos del management.
        Si no hay management_id en query params, retorna todos los servicios.
        
        Query Parameters:
        - management_id: ID del management para filtrar servicios
        """
        management_id = self.request.query_params.get('management_id', None)
        
        if management_id:
            # Servicios básicos (IDs: 1, 2, 3) + servicios del management específico
            from django.db.models import Q
            return TypeServices.objects.filter(
                Q(pk_type_services__in=[1, 2, 3]) |  # Servicios básicos
                Q(fk_management_id=management_id)    # Servicios del management
            ).distinct()
        
        # Si no hay management_id, retornar todos (para compatibilidad)
        return TypeServices.objects.all()

class ServicesViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Services instances.
    Filters services by management_id to ensure users only see their own services.
    
    Query Parameters:
    - management_id (optional): Filter services by management ID. If provided, only returns services for that management.
    """
    serializer_class = ServicesSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'management_id',
                openapi.IN_QUERY,
                description="Filter services by management ID",
                type=openapi.TYPE_INTEGER,
                required=False
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        """
        Retorna solo los servicios del management especificado.
        Si no hay management_id en query params, retorna servicios vacíos por seguridad.
        
        Query Parameters:
        - management_id: ID del management para filtrar servicios
        """
        management_id = self.request.query_params.get('management_id', None)
        
        if management_id:
            return Services.objects.filter(fk_management_id=management_id).order_by('-scheduled_date')
        
        # Por seguridad, si no hay management_id, no retornar nada
        return Services.objects.none()
    
    def perform_create(self, serializer):
        """
        Automatically assign the management_id when creating a service.
        The management_id should be provided in the request data.
        """
        management_id = self.request.data.get('fk_management')
        if management_id:
            serializer.save(fk_management_id=management_id)
        else:
            # Si no se proporciona management_id, usar el del usuario autenticado si está disponible
            serializer.save()

class ServiceLogViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing ServiceLog instances.
    Provides automatic CRUD operations for ServiceLog.
    """
    queryset = ServiceLog.objects.all()
    serializer_class = ServiceLogSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    
    def get_queryset(self):
        """
        Optionally filters ServiceLogs by service_id or user_id from query params
        """
        queryset = ServiceLog.objects.all()
        service_id = self.request.query_params.get('service_id', None)
        user_id = self.request.query_params.get('user_id', None)
        
        if service_id is not None:
            queryset = queryset.filter(fk_services__pk_services=service_id)
        if user_id is not None:
            queryset = queryset.filter(fk_user__id=user_id)
            
        return queryset.order_by('-completed_date')

class CreateTypeServiceView(APIView):
    def post(self, request, management_id):
        try:
            management = Management.objects.get(pk=management_id)
        except Management.DoesNotExist:
            return Response(
                {"error": "Management no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        data = request.data.copy()
        data['fk_management'] = management_id
        
        serializer = TypeServicesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def backup_database(request):
    db = settings.DATABASES['default']
    db_name = db['NAME']
    db_user = db['USER']
    db_password = db['PASSWORD']
    db_host = db.get('HOST', 'localhost')
    db_port = db.get('PORT', '5432')

    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = os.path.join(settings.BASE_DIR, 'backups/CompleteDB')
    os.makedirs(backup_dir, exist_ok=True)
    backup_file = os.path.join(backup_dir, f'backup_{timestamp}.backup')

    try:
        subprocess.run(
            [
                'pg_dump',
                '-h', db_host,
                '-p', str(db_port),
                '-U', db_user,
                '-F', 'c',
                '-f', backup_file,
                db_name
            ],
            env={**os.environ, 'PGPASSWORD': db_password},
            check=True
        )
        return Response({'message': f'Backup creado en: {backup_file}'}, status=status.HTTP_201_CREATED)
    except subprocess.CalledProcessError as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def destroy_and_restore_last_backup(request):
    db = settings.DATABASES['default']
    db_name = db['NAME']
    db_user = db['USER']
    db_password = db['PASSWORD']
    db_host = db.get('HOST', 'localhost')
    db_port = db.get('PORT', '5432')

    backup_dir = os.path.join(settings.BASE_DIR, 'backups/CompleteDB')
    backup_files = [f for f in os.listdir(backup_dir) if f.endswith('.backup')]
    if not backup_files:
        return Response({'error': 'No hay backups disponibles.'}, status=status.HTTP_404_NOT_FOUND)

    # Último backup (más reciente por nombre)
    backup_files.sort(reverse=True)
    latest_backup = os.path.join(backup_dir, backup_files[0])

    try:
        # 1. Cerrar conexiones activas a la base de datos
        subprocess.run(
            [
                'psql',
                '-h', db_host,
                '-p', str(db_port),
                '-U', db_user,
                '-d', 'postgres',
                '-c',
                f"""
                SELECT pg_terminate_backend(pid)
                FROM pg_stat_activity
                WHERE datname = '{db_name}' AND pid <> pg_backend_pid();
                """
            ],
            env={**os.environ, 'PGPASSWORD': db_password},
            check=True
        )

        # 2. Eliminar la base de datos actual
        subprocess.run(
            [
                'psql',
                '-h', db_host,
                '-p', str(db_port),
                '-U', db_user,
                '-d', 'postgres',
                '-c', f'DROP DATABASE IF EXISTS "{db_name}";'
            ],
            env={**os.environ, 'PGPASSWORD': db_password},
            check=True
        )

        # 3. Crear la base de datos vacía
        subprocess.run(
            [
                'psql',
                '-h', db_host,
                '-p', str(db_port),
                '-U', db_user,
                '-d', 'postgres',
                '-c', f'CREATE DATABASE "{db_name}";'
            ],
            env={**os.environ, 'PGPASSWORD': db_password},
            check=True
        )

        # 4. Restaurar desde el backup
        subprocess.run(
            [
                'pg_restore',
                '-h', db_host,
                '-p', str(db_port),
                '-U', db_user,
                '-d', db_name,
                '--no-owner',
                latest_backup
            ],
            env={**os.environ, 'PGPASSWORD': db_password},
            check=True
        )

        return Response({'message': f'DB restaurada desde: {latest_backup}'}, status=status.HTTP_200_OK)

    except subprocess.CalledProcessError as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def destroy_and_restore_base(request):
    db = settings.DATABASES['default']
    db_name = db['NAME']
    db_user = db['USER']
    db_password = db['PASSWORD']
    db_host = db.get('HOST', 'localhost')
    db_port = db.get('PORT', '5432')

    backup_dir = os.path.join(settings.BASE_DIR, 'backups/CompleteDB')
    initial_backup = os.path.join(backup_dir, 'BDInitial.backup')

    if not os.path.exists(initial_backup):
        return Response({'error': 'El archivo BDInitial.backup no existe.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        # 1. Cerrar conexiones activas a la base de datos
        subprocess.run(
            [
                'psql',
                '-h', db_host,
                '-p', str(db_port),
                '-U', db_user,
                '-d', 'postgres',
                '-c',
                f"""
                SELECT pg_terminate_backend(pid)
                FROM pg_stat_activity
                WHERE datname = '{db_name}' AND pid <> pg_backend_pid();
                """
            ],
            env={**os.environ, 'PGPASSWORD': db_password},
            check=True
        )

        # 2. Eliminar la base de datos actual
        subprocess.run(
            [
                'psql',
                '-h', db_host,
                '-p', str(db_port),
                '-U', db_user,
                '-d', 'postgres',
                '-c', f'DROP DATABASE IF EXISTS "{db_name}";'
            ],
            env={**os.environ, 'PGPASSWORD': db_password},
            check=True
        )

        # 3. Crear la base de datos vacía
        subprocess.run(
            [
                'psql',
                '-h', db_host,
                '-p', str(db_port),
                '-U', db_user,
                '-d', 'postgres',
                '-c', f'CREATE DATABASE "{db_name}";'
            ],
            env={**os.environ, 'PGPASSWORD': db_password},
            check=True
        )

        # 4. Restaurar desde el archivo BDInitial.backup
        subprocess.run(
            [
                'pg_restore',
                '-h', db_host,
                '-p', str(db_port),
                '-U', db_user,
                '-d', db_name,
                '--no-owner',
                initial_backup
            ],
            env={**os.environ, 'PGPASSWORD': db_password},
            check=True
        )

        return Response({'message': f'DB restaurada desde: {initial_backup}'}, status=status.HTTP_200_OK)

    except subprocess.CalledProcessError as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def export_table_to_csv(request):
    tables = request.data.get('tables')
    if not tables or not isinstance(tables, list):
        return Response({'error': 'El parámetro "tables" debe ser una lista de nombres de tablas.'},
                        status=status.HTTP_400_BAD_REQUEST)

    db = settings.DATABASES['default']
    db_name = db['NAME']
    db_user = db['USER']
    db_password = db['PASSWORD']
    db_host = db.get('HOST', 'localhost')
    db_port = db.get('PORT', '5432')

    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    exported_files = {}

    try:
        conn = psycopg2.connect(
            dbname=db_name,
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port
        )
        cursor = conn.cursor()

        for table_name in tables:
            export_dir = os.path.join(settings.BASE_DIR, f'backups/CSV/{table_name}')
            os.makedirs(export_dir, exist_ok=True)
            csv_file = os.path.join(export_dir, f'{table_name}_{timestamp}.csv')

            try:
                cursor.execute(f'SELECT * FROM "{table_name}";')
                rows = cursor.fetchall()
                column_names = [desc[0] for desc in cursor.description]

                with open(csv_file, mode='w', newline='', encoding='utf-8') as f:
                    writer = csv.writer(f)
                    writer.writerow(column_names)
                    writer.writerows(rows)

                exported_files[table_name] = csv_file

            except Exception as e_table:
                exported_files[table_name] = f'Error: {str(e_table)}'

        cursor.close()
        conn.close()

        return Response({'exports': exported_files}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def restore_table_from_latest_csv(request):
    tables = request.data.get('tables')
    if not tables or not isinstance(tables, list):
        return Response({'error': 'El parámetro "tables" debe ser una lista de nombres de tablas.'},
                        status=status.HTTP_400_BAD_REQUEST)

    db = settings.DATABASES['default']
    try:
        conn = psycopg2.connect(
            dbname=db['NAME'],
            user=db['USER'],
            password=db['PASSWORD'],
            host=db.get('HOST', 'localhost'),
            port=db.get('PORT', '5432')
        )
        cursor = conn.cursor()

        results = {}

        for table_name in tables:
            latest_csv = get_latest_csv_for_table(table_name)
            if not latest_csv:
                results[table_name] = f'No se encontró respaldo CSV para la tabla "{table_name}".'
                continue

            try:
                # Leer CSV
                with open(latest_csv, mode='r', encoding='utf-8') as f:
                    reader = csv.reader(f)
                    headers = next(reader)
                    rows = list(reader)

                # Limpiar tabla
                cursor.execute(f'TRUNCATE TABLE "{table_name}" RESTART IDENTITY CASCADE;')

                # Insertar datos
                placeholders = ','.join(['%s'] * len(headers))
                insert_query = f'INSERT INTO "{table_name}" ({",".join(headers)}) VALUES ({placeholders})'

                for row in rows:
                    cursor.execute(insert_query, row)

                results[table_name] = f'Tabla restaurada desde: {latest_csv}'

            except Exception as e_table:
                results[table_name] = f'Error restaurando tabla: {str(e_table)}'

        conn.commit()
        cursor.close()
        conn.close()

        return Response({'results': results}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def list_all_tables(request):
    try:
        conn = psycopg2.connect(
            dbname=settings.DATABASES['default']['NAME'],
            user=settings.DATABASES['default']['USER'],
            password=settings.DATABASES['default']['PASSWORD'],
            host=settings.DATABASES['default'].get('HOST', 'localhost'),
            port=settings.DATABASES['default'].get('PORT', '5432')
        )
        cursor = conn.cursor()
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type='BASE TABLE';
        """)
        tables = [row[0] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return Response(tables)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
def get_latest_csv_for_table(table_name):
    export_dir = os.path.join(settings.BASE_DIR, f'backups/CSV/{table_name}')
    if not os.path.exists(export_dir):
        return None

    csv_files = glob.glob(os.path.join(export_dir, f"{table_name}_*.csv"))
    if not csv_files:
        return None

    csv_files.sort(reverse=True)

    return csv_files[0]

# @api_view(['POST'])
# def restore_table_from_latest_csv(request):
#     table_name = request.data.get('table')
#     if not table_name:
#         return Response({'error': 'El parámetro "table" es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

#     latest_csv = get_latest_csv_for_table(table_name)
#     if not latest_csv:
#         return Response({'error': f'No se encontró ningún respaldo CSV para la tabla "{table_name}".'}, status=status.HTTP_404_NOT_FOUND)

#     try:
#         db = settings.DATABASES['default']
#         conn = psycopg2.connect(
#             dbname=db['NAME'],
#             user=db['USER'],
#             password=db['PASSWORD'],
#             host=db.get('HOST', 'localhost'),
#             port=db.get('PORT', '5432')
#         )
#         cursor = conn.cursor()

#         # Leer CSV
#         with open(latest_csv, mode='r', encoding='utf-8') as f:
#             reader = csv.reader(f)
#             headers = next(reader)
#             rows = list(reader)

#         # Limpiar tabla
#         cursor.execute(f'TRUNCATE TABLE "{table_name}" RESTART IDENTITY CASCADE;')

#         # Insertar datos
#         placeholders = ','.join(['%s'] * len(headers))
#         insert_query = f'INSERT INTO "{table_name}" ({",".join(headers)}) VALUES ({placeholders})'

#         for row in rows:
#             cursor.execute(insert_query, row)

#         conn.commit()
#         cursor.close()
#         conn.close()

#         return Response({'message': f'Tabla "{table_name}" restaurada desde: {latest_csv}'}, status=status.HTTP_200_OK)

#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StatusViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Status instances.
    """
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class TypeServicesViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing TypeServices instances.
    """
    queryset = TypeServices.objects.all()
    serializer_class = TypeServicesSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class ServicesViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Services instances.
    """
    queryset = Services.objects.all()
    serializer_class = ServicesSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class ServiceLogViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing ServiceLog instances.
    Provides automatic CRUD operations for ServiceLog.
    """
    queryset = ServiceLog.objects.all()
    serializer_class = ServiceLogSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    
    def get_queryset(self):
        """
        Optionally filters ServiceLogs by service_id or user_id from query params
        """
        queryset = ServiceLog.objects.all()
        service_id = self.request.query_params.get('service_id', None)
        user_id = self.request.query_params.get('user_id', None)
        
        if service_id is not None:
            queryset = queryset.filter(fk_services__pk_services=service_id)
        if user_id is not None:
            queryset = queryset.filter(fk_user__id=user_id)
            
        return queryset.order_by('-completed_date')

class CreateTypeServiceView(APIView):
    def post(self, request, management_id):
        try:
            management = Management.objects.get(pk=management_id)
        except Management.DoesNotExist:
            return Response(
                {"error": "Management no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        data = request.data.copy()
        data['fk_management'] = management_id
        
        serializer = TypeServicesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



