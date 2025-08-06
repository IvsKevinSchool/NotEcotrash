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
        Retorna los servicios globales (fk_management=NULL) más los servicios específicos del management.
        Si no hay management_id en query params, retorna solo los servicios globales por seguridad.
        
        Query Parameters:
        - management_id: ID del management para filtrar servicios
        """
        management_id = self.request.query_params.get('management_id', None)
        
        if management_id:
            # Servicios globales (fk_management=NULL) + servicios del management específico
            from django.db.models import Q
            return TypeServices.objects.filter(
                Q(fk_management__isnull=True) |      # Servicios globales
                Q(fk_management_id=management_id)    # Servicios del management
            ).distinct()
        
        # Si no hay management_id, retornar solo servicios globales por seguridad
        return TypeServices.objects.filter(fk_management__isnull=True)
    
    def get_object(self):
        """
        Para operaciones individuales (GET, PUT, PATCH, DELETE), permitir acceso a cualquier servicio
        sin restricciones de management para evitar errores 404 en operaciones legítimas.
        """
        pk = self.kwargs.get('pk')
        if pk:
            try:
                return TypeServices.objects.get(pk=pk)
            except TypeServices.DoesNotExist:
                from rest_framework.exceptions import NotFound
                raise NotFound("TypeService not found")
        
        # Si no hay pk, usar el comportamiento por defecto
        return super().get_object()

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
        Automatically assign the management_id and status when creating a service.
        Los servicios creados por clientes deben tener status "Pendiente" por defecto.
        """
        management_id = self.request.data.get('fk_management')
        
        # Obtener el status "Pendiente" por defecto para nuevos servicios
        try:
            pending_status = Status.objects.get(name='Pendiente')
            
            if management_id:
                serializer.save(
                    fk_management_id=management_id,
                    fk_status=pending_status
                )
            else:
                # Si no se proporciona management_id, usar el del usuario autenticado si está disponible
                serializer.save(fk_status=pending_status)
        except Status.DoesNotExist:
            # Si no existe el status "Pendiente", usar el valor proporcionado o el primero disponible
            if management_id:
                serializer.save(fk_management_id=management_id)
            else:
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




 
 #   = = = = = = =   N U E V A S   V I S T A S   P A R A   G E S T I �  N   D E   S E R V I C I O S   = = = = = = = 
 
 
 
 c l a s s   P e n d i n g S e r v i c e s V i e w ( A P I V i e w ) : 
 
         " " " 
 
         V i s t a   p a r a   o b t e n e r   s e r v i c i o s   p e n d i e n t e s   d e   a p r o b a c i � � n 
 
         " " " 
 
         d e f   g e t ( s e l f ,   r e q u e s t ,   m a n a g e m e n t _ i d ) : 
 
                 t r y : 
 
                         m a n a g e m e n t   =   M a n a g e m e n t . o b j e c t s . g e t ( p k = m a n a g e m e n t _ i d ) 
 
                 e x c e p t   M a n a g e m e n t . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " M a n a g e m e n t   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 #   B u s c a r   e l   s t a t u s   " P e n d i e n t e " 
 
                 t r y : 
 
                         p e n d i n g _ s t a t u s   =   S t a t u s . o b j e c t s . g e t ( n a m e = ' P e n d i e n t e ' ) 
 
                 e x c e p t   S t a t u s . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S t a t u s   ' P e n d i e n t e '   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 #   O b t e n e r   s e r v i c i o s   p e n d i e n t e s   p a r a   e s t e   m a n a g e m e n t 
 
                 p e n d i n g _ s e r v i c e s   =   S e r v i c e s . o b j e c t s . f i l t e r ( 
 
                         f k _ m a n a g e m e n t = m a n a g e m e n t , 
 
                         f k _ s t a t u s = p e n d i n g _ s t a t u s 
 
                 ) . o r d e r _ b y ( ' - s c h e d u l e d _ d a t e ' ) 
 
                 
 
                 s e r i a l i z e r   =   S e r v i c e s S e r i a l i z e r ( p e n d i n g _ s e r v i c e s ,   m a n y = T r u e ) 
 
                 r e t u r n   R e s p o n s e ( s e r i a l i z e r . d a t a ) 
 
 
 
 
 
 c l a s s   A p p r o v e S e r v i c e V i e w ( A P I V i e w ) : 
 
         " " " 
 
         V i s t a   p a r a   a p r o b a r   u n   s e r v i c i o   ( c a m b i a r   s t a t u s   a   " A p r o b a d o " ) 
 
         " " " 
 
         d e f   p a t c h ( s e l f ,   r e q u e s t ,   s e r v i c e _ i d ) : 
 
                 t r y : 
 
                         s e r v i c e   =   S e r v i c e s . o b j e c t s . g e t ( p k = s e r v i c e _ i d ) 
 
                 e x c e p t   S e r v i c e s . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S e r v i c i o   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 #   V e r i f i c a r   q u e   e l   s e r v i c i o   e s t � �   p e n d i e n t e 
 
                 i f   s e r v i c e . f k _ s t a t u s . n a m e   ! =   ' P e n d i e n t e ' : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S o l o   s e   p u e d e n   a p r o b a r   s e r v i c i o s   p e n d i e n t e s " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 0 _ B A D _ R E Q U E S T 
 
                         ) 
 
                 
 
                 #   C a m b i a r   s t a t u s   a   " A p r o b a d o " 
 
                 t r y : 
 
                         a p p r o v e d _ s t a t u s   =   S t a t u s . o b j e c t s . g e t ( n a m e = ' A p r o b a d o ' ) 
 
                         s e r v i c e . f k _ s t a t u s   =   a p p r o v e d _ s t a t u s 
 
                         s e r v i c e . s a v e ( ) 
 
                         
 
                         s e r i a l i z e r   =   S e r v i c e s S e r i a l i z e r ( s e r v i c e ) 
 
                         r e t u r n   R e s p o n s e ( s e r i a l i z e r . d a t a ) 
 
                 e x c e p t   S t a t u s . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S t a t u s   ' A p r o b a d o '   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
 
 
 
 
 c l a s s   R e j e c t S e r v i c e V i e w ( A P I V i e w ) : 
 
         " " " 
 
         V i s t a   p a r a   r e c h a z a r   u n   s e r v i c i o   ( c a m b i a r   s t a t u s   a   " C a n c e l a d o " ) 
 
         " " " 
 
         d e f   p a t c h ( s e l f ,   r e q u e s t ,   s e r v i c e _ i d ) : 
 
                 t r y : 
 
                         s e r v i c e   =   S e r v i c e s . o b j e c t s . g e t ( p k = s e r v i c e _ i d ) 
 
                 e x c e p t   S e r v i c e s . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S e r v i c i o   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 #   V e r i f i c a r   q u e   e l   s e r v i c i o   e s t � �   p e n d i e n t e 
 
                 i f   s e r v i c e . f k _ s t a t u s . n a m e   ! =   ' P e n d i e n t e ' : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S o l o   s e   p u e d e n   r e c h a z a r   s e r v i c i o s   p e n d i e n t e s " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 0 _ B A D _ R E Q U E S T 
 
                         ) 
 
                 
 
                 #   C a m b i a r   s t a t u s   a   " C a n c e l a d o " 
 
                 t r y : 
 
                         c a n c e l l e d _ s t a t u s   =   S t a t u s . o b j e c t s . g e t ( n a m e = ' C a n c e l a d o ' ) 
 
                         s e r v i c e . f k _ s t a t u s   =   c a n c e l l e d _ s t a t u s 
 
                         s e r v i c e . s a v e ( ) 
 
                         
 
                         s e r i a l i z e r   =   S e r v i c e s S e r i a l i z e r ( s e r v i c e ) 
 
                         r e t u r n   R e s p o n s e ( s e r i a l i z e r . d a t a ) 
 
                 e x c e p t   S t a t u s . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S t a t u s   ' C a n c e l a d o '   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
 
 
 
 
 c l a s s   T o d a y S c h e d u l e d S e r v i c e s V i e w ( A P I V i e w ) : 
 
         " " " 
 
         V i s t a   p a r a   o b t e n e r   s e r v i c i o s   p r o g r a m a d o s   p a r a   h o y   q u e   e s t � � n   a p r o b a d o s 
 
         " " " 
 
         d e f   g e t ( s e l f ,   r e q u e s t ,   m a n a g e m e n t _ i d ) : 
 
                 f r o m   d a t e t i m e   i m p o r t   d a t e 
 
                 
 
                 t r y : 
 
                         m a n a g e m e n t   =   M a n a g e m e n t . o b j e c t s . g e t ( p k = m a n a g e m e n t _ i d ) 
 
                 e x c e p t   M a n a g e m e n t . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " M a n a g e m e n t   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 #   B u s c a r   e l   s t a t u s   " A p r o b a d o " 
 
                 t r y : 
 
                         a p p r o v e d _ s t a t u s   =   S t a t u s . o b j e c t s . g e t ( n a m e = ' A p r o b a d o ' ) 
 
                 e x c e p t   S t a t u s . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S t a t u s   ' A p r o b a d o '   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 #   O b t e n e r   s e r v i c i o s   p r o g r a m a d o s   p a r a   h o y 
 
                 t o d a y _ s e r v i c e s   =   S e r v i c e s . o b j e c t s . f i l t e r ( 
 
                         f k _ m a n a g e m e n t = m a n a g e m e n t , 
 
                         f k _ s t a t u s = a p p r o v e d _ s t a t u s , 
 
                         s c h e d u l e d _ d a t e = d a t e . t o d a y ( ) 
 
                 ) . o r d e r _ b y ( ' s c h e d u l e d _ d a t e ' ) 
 
                 
 
                 s e r i a l i z e r   =   S e r v i c e s S e r i a l i z e r ( t o d a y _ s e r v i c e s ,   m a n y = T r u e ) 
 
                 r e t u r n   R e s p o n s e ( s e r i a l i z e r . d a t a ) 
 
 
 
 
 
 c l a s s   A s s i g n C o l l e c t o r V i e w ( A P I V i e w ) : 
 
         " " " 
 
         V i s t a   p a r a   a s i g n a r   u n   c o l l e c t o r   a   u n   s e r v i c i o   y   c a m b i a r   s t a t u s   a   " E n   c u r s o " 
 
         " " " 
 
         d e f   p a t c h ( s e l f ,   r e q u e s t ,   s e r v i c e _ i d ) : 
 
                 t r y : 
 
                         s e r v i c e   =   S e r v i c e s . o b j e c t s . g e t ( p k = s e r v i c e _ i d ) 
 
                 e x c e p t   S e r v i c e s . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S e r v i c i o   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 c o l l e c t o r _ i d   =   r e q u e s t . d a t a . g e t ( ' c o l l e c t o r _ i d ' ) 
 
                 i f   n o t   c o l l e c t o r _ i d : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " c o l l e c t o r _ i d   e s   r e q u e r i d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 0 _ B A D _ R E Q U E S T 
 
                         ) 
 
                 
 
                 #   V e r i f i c a r   q u e   e l   c o l l e c t o r   e x i s t e   y   t i e n e   r o l   d e   c o l l e c t o r 
 
                 t r y : 
 
                         f r o m   a p p s . a c c o u n t s . m o d e l s   i m p o r t   U s e r 
 
                         c o l l e c t o r   =   U s e r . o b j e c t s . g e t ( p k = c o l l e c t o r _ i d ,   r o l e = ' c o l l e c t o r ' ) 
 
                 e x c e p t   U s e r . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " C o l l e c t o r   n o   e n c o n t r a d o   o   n o   t i e n e   r o l   d e   c o l l e c t o r " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 #   V e r i f i c a r   q u e   e l   s e r v i c i o   e s t � �   a p r o b a d o 
 
                 i f   s e r v i c e . f k _ s t a t u s . n a m e   ! =   ' A p r o b a d o ' : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S o l o   s e   p u e d e n   a s i g n a r   c o l l e c t o r s   a   s e r v i c i o s   a p r o b a d o s " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 0 _ B A D _ R E Q U E S T 
 
                         ) 
 
                 
 
                 #   A s i g n a r   c o l l e c t o r   y   c a m b i a r   s t a t u s   a   " E n   c u r s o " 
 
                 t r y : 
 
                         i n _ p r o g r e s s _ s t a t u s   =   S t a t u s . o b j e c t s . g e t ( n a m e = ' E n   c u r s o ' ) 
 
                         s e r v i c e . f k _ c o l l e c t o r   =   c o l l e c t o r 
 
                         s e r v i c e . f k _ s t a t u s   =   i n _ p r o g r e s s _ s t a t u s 
 
                         s e r v i c e . s a v e ( ) 
 
                         
 
                         #   T O D O :   A q u � �   s e   p u e d e   a g r e g a r   n o t i f i c a c i � � n   a l   c o l l e c t o r 
 
                         
 
                         s e r i a l i z e r   =   S e r v i c e s S e r i a l i z e r ( s e r v i c e ) 
 
                         r e t u r n   R e s p o n s e ( s e r i a l i z e r . d a t a ) 
 
                 e x c e p t   S t a t u s . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S t a t u s   ' E n   c u r s o '   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
 
 
 
 
 c l a s s   C o l l e c t o r S e r v i c e s V i e w ( A P I V i e w ) : 
 
         " " " 
 
         V i s t a   p a r a   o b t e n e r   s e r v i c i o s   a s i g n a d o s   a   u n   c o l l e c t o r 
 
         " " " 
 
         d e f   g e t ( s e l f ,   r e q u e s t ,   c o l l e c t o r _ i d ) : 
 
                 f r o m   d a t e t i m e   i m p o r t   d a t e 
 
                 
 
                 t r y : 
 
                         f r o m   a p p s . a c c o u n t s . m o d e l s   i m p o r t   U s e r 
 
                         c o l l e c t o r   =   U s e r . o b j e c t s . g e t ( p k = c o l l e c t o r _ i d ,   r o l e = ' c o l l e c t o r ' ) 
 
                 e x c e p t   U s e r . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " C o l l e c t o r   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 #   O b t e n e r   s e r v i c i o s   a s i g n a d o s   a l   c o l l e c t o r   p a r a   h o y 
 
                 c o l l e c t o r _ s e r v i c e s   =   S e r v i c e s . o b j e c t s . f i l t e r ( 
 
                         f k _ c o l l e c t o r = c o l l e c t o r , 
 
                         s c h e d u l e d _ d a t e = d a t e . t o d a y ( ) 
 
                 ) . o r d e r _ b y ( ' s c h e d u l e d _ d a t e ' ) 
 
                 
 
                 s e r i a l i z e r   =   S e r v i c e s S e r i a l i z e r ( c o l l e c t o r _ s e r v i c e s ,   m a n y = T r u e ) 
 
                 r e t u r n   R e s p o n s e ( s e r i a l i z e r . d a t a ) 
 
 
 
 
 
 c l a s s   C o m p l e t e S e r v i c e V i e w ( A P I V i e w ) : 
 
         " " " 
 
         V i s t a   p a r a   q u e   e l   c o l l e c t o r   m a r q u e   u n   s e r v i c i o   c o m o   c o m p l e t a d o 
 
         " " " 
 
         d e f   p a t c h ( s e l f ,   r e q u e s t ,   s e r v i c e _ i d ) : 
 
                 t r y : 
 
                         s e r v i c e   =   S e r v i c e s . o b j e c t s . g e t ( p k = s e r v i c e _ i d ) 
 
                 e x c e p t   S e r v i c e s . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S e r v i c i o   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 #   V e r i f i c a r   q u e   e l   s e r v i c i o   e s t � �   e n   c u r s o 
 
                 i f   s e r v i c e . f k _ s t a t u s . n a m e   ! =   ' E n   c u r s o ' : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S o l o   s e   p u e d e n   c o m p l e t a r   s e r v i c i o s   e n   c u r s o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 0 _ B A D _ R E Q U E S T 
 
                         ) 
 
                 
 
                 #   C a m b i a r   s t a t u s   a   " C o m p l e t a d o " 
 
                 t r y : 
 
                         c o m p l e t e d _ s t a t u s   =   S t a t u s . o b j e c t s . g e t ( n a m e = ' C o m p l e t a d o ' ) 
 
                         s e r v i c e . f k _ s t a t u s   =   c o m p l e t e d _ s t a t u s 
 
                         s e r v i c e . s a v e ( ) 
 
                         
 
                         s e r i a l i z e r   =   S e r v i c e s S e r i a l i z e r ( s e r v i c e ) 
 
                         r e t u r n   R e s p o n s e ( s e r i a l i z e r . d a t a ) 
 
                 e x c e p t   S t a t u s . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " S t a t u s   ' C o m p l e t a d o '   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
 
 
 
 
 c l a s s   F i l t e r e d S e r v i c e s V i e w ( A P I V i e w ) : 
 
         " " " 
 
         V i s t a   p a r a   o b t e n e r   s e r v i c i o s   f i l t r a d o s   p o r   s t a t u s   y   f e c h a 
 
         " " " 
 
         d e f   g e t ( s e l f ,   r e q u e s t ,   m a n a g e m e n t _ i d ) : 
 
                 t r y : 
 
                         m a n a g e m e n t   =   M a n a g e m e n t . o b j e c t s . g e t ( p k = m a n a g e m e n t _ i d ) 
 
                 e x c e p t   M a n a g e m e n t . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " M a n a g e m e n t   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 #   O b t e n e r   p a r � � m e t r o s   d e   f i l t r o 
 
                 s t a t u s _ n a m e s   =   r e q u e s t . q u e r y _ p a r a m s . g e t l i s t ( ' s t a t u s ' )     #   L i s t a   d e   n o m b r e s   d e   s t a t u s 
 
                 s t a r t _ d a t e   =   r e q u e s t . q u e r y _ p a r a m s . g e t ( ' s t a r t _ d a t e ' ) 
 
                 e n d _ d a t e   =   r e q u e s t . q u e r y _ p a r a m s . g e t ( ' e n d _ d a t e ' ) 
 
                 
 
                 #   C o n s t r u i r   q u e r y   b a s e 
 
                 s e r v i c e s   =   S e r v i c e s . o b j e c t s . f i l t e r ( f k _ m a n a g e m e n t = m a n a g e m e n t ) 
 
                 
 
                 #   F i l t r a r   p o r   s t a t u s   s i   s e   p r o p o r c i o n a n 
 
                 i f   s t a t u s _ n a m e s : 
 
                         s e r v i c e s   =   s e r v i c e s . f i l t e r ( f k _ s t a t u s _ _ n a m e _ _ i n = s t a t u s _ n a m e s ) 
 
                 
 
                 #   F i l t r a r   p o r   r a n g o   d e   f e c h a s 
 
                 i f   s t a r t _ d a t e : 
 
                         s e r v i c e s   =   s e r v i c e s . f i l t e r ( s c h e d u l e d _ d a t e _ _ g t e = s t a r t _ d a t e ) 
 
                 i f   e n d _ d a t e : 
 
                         s e r v i c e s   =   s e r v i c e s . f i l t e r ( s c h e d u l e d _ d a t e _ _ l t e = e n d _ d a t e ) 
 
                 
 
                 s e r v i c e s   =   s e r v i c e s . o r d e r _ b y ( ' - s c h e d u l e d _ d a t e ' ) 
 
                 
 
                 s e r i a l i z e r   =   S e r v i c e s S e r i a l i z e r ( s e r v i c e s ,   m a n y = T r u e ) 
 
                 r e t u r n   R e s p o n s e ( s e r i a l i z e r . d a t a ) 
 
 
 
 
 
 c l a s s   A v a i l a b l e C o l l e c t o r s V i e w ( A P I V i e w ) : 
 
         " " " 
 
         V i s t a   p a r a   o b t e n e r   c o l l e c t o r s   d i s p o n i b l e s   d e   u n   m a n a g e m e n t 
 
         " " " 
 
         d e f   g e t ( s e l f ,   r e q u e s t ,   m a n a g e m e n t _ i d ) : 
 
                 t r y : 
 
                         m a n a g e m e n t   =   M a n a g e m e n t . o b j e c t s . g e t ( p k = m a n a g e m e n t _ i d ) 
 
                 e x c e p t   M a n a g e m e n t . D o e s N o t E x i s t : 
 
                         r e t u r n   R e s p o n s e ( 
 
                                 { " e r r o r " :   " M a n a g e m e n t   n o   e n c o n t r a d o " } , 
 
                                 s t a t u s = s t a t u s . H T T P _ 4 0 4 _ N O T _ F O U N D 
 
                         ) 
 
                 
 
                 #   O b t e n e r   c o l l e c t o r s   a s o c i a d o s   a   e s t e   m a n a g e m e n t 
 
                 f r o m   a p p s . m a n a g e m e n t . m o d e l s   i m p o r t   C o l l e c t o r U s e r s 
 
                 f r o m   a p p s . a c c o u n t s . a p i . s e r i a l i z e r s   i m p o r t   U s e r L i s t S e r i a l i z e r 
 
                 
 
                 c o l l e c t o r _ u s e r s   =   C o l l e c t o r U s e r s . o b j e c t s . f i l t e r ( 
 
                         f k _ m a n a g e m e n t = m a n a g e m e n t 
 
                 ) . s e l e c t _ r e l a t e d ( ' f k _ u s e r ' ) 
 
                 
 
                 c o l l e c t o r s   =   [ c u . f k _ u s e r   f o r   c u   i n   c o l l e c t o r _ u s e r s   i f   c u . f k _ u s e r . r o l e   = =   ' c o l l e c t o r ' ] 
 
                 
 
                 s e r i a l i z e r   =   U s e r L i s t S e r i a l i z e r ( c o l l e c t o r s ,   m a n y = T r u e ) 
 
                 r e t u r n   R e s p o n s e ( s e r i a l i z e r . d a t a ) 
 
 