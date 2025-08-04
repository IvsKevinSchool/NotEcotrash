from rest_framework import viewsets
from apps.services.models import Status, TypeServices, Services, ServiceLog, RecurringService, ServiceNotification
from apps.management.models import Management
from apps.services.api.serializer import (
    StatusSerializer, TypeServicesSerializer, ServicesSerializer, ServiceLogSerializer,
    RecurringServiceSerializer, ServiceNotificationSerializer, RecurringServiceCreateSerializer
)
from rest_framework.decorators import api_view, action
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
<<<<<<< Updated upstream
=======
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
>>>>>>> Stashed changes


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
    table_name = request.data.get('table')
    if not table_name:
        return Response({'error': 'El parámetro "table" es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

    db = settings.DATABASES['default']
    db_name = db['NAME']
    db_user = db['USER']
    db_password = db['PASSWORD']
    db_host = db.get('HOST', 'localhost')
    db_port = db.get('PORT', '5432')

    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    export_dir = os.path.join(settings.BASE_DIR, f'backups/CSV/{table_name}')
    os.makedirs(export_dir, exist_ok=True)
    csv_file = os.path.join(export_dir, f'{table_name}_{timestamp}.csv')

    try:
        conn = psycopg2.connect(
            dbname=db_name,
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port
        )
        cursor = conn.cursor()

        # Comillas dobles para evitar problemas con nombres raros o sensibles a mayúsculas
        cursor.execute(f'SELECT * FROM "{table_name}";')
        rows = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]

        with open(csv_file, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(column_names)
            writer.writerows(rows)

        cursor.close()
        conn.close()

        return Response({'message': f'CSV exportado en: {csv_file}'}, status=status.HTTP_201_CREATED)

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

@api_view(['POST'])
def restore_table_from_latest_csv(request):
    table_name = request.data.get('table')
    if not table_name:
        return Response({'error': 'El parámetro "table" es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

    latest_csv = get_latest_csv_for_table(table_name)
    if not latest_csv:
        return Response({'error': f'No se encontró ningún respaldo CSV para la tabla "{table_name}".'}, status=status.HTTP_404_NOT_FOUND)

    try:
        db = settings.DATABASES['default']
        conn = psycopg2.connect(
            dbname=db['NAME'],
            user=db['USER'],
            password=db['PASSWORD'],
            host=db.get('HOST', 'localhost'),
            port=db.get('PORT', '5432')
        )
        cursor = conn.cursor()

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

        conn.commit()
        cursor.close()
        conn.close()

<<<<<<< Updated upstream
        return Response({'message': f'Tabla "{table_name}" restaurada desde: {latest_csv}'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
=======
class RecurringServiceViewSet(viewsets.ModelViewSet):
    """
    ViewSet para servicios recurrentes.
    Permite crear, leer, actualizar y eliminar servicios recurrentes.
    """
    queryset = RecurringService.objects.all()
    serializer_class = RecurringServiceSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    
    def get_queryset(self):
        """Filtrar servicios recurrentes según el usuario"""
        queryset = RecurringService.objects.all()
        
        # Filtros por query parameters
        client_id = self.request.query_params.get('client_id', None)
        management_id = self.request.query_params.get('management_id', None)
        status_filter = self.request.query_params.get('status', None)
        
        if client_id:
            queryset = queryset.filter(fk_client__pk_client=client_id)
        if management_id:
            queryset = queryset.filter(fk_management__pk_management=management_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-created_at')
    
    def get_serializer_class(self):
        """Usar serializer diferente para creación"""
        if self.action == 'create':
            return RecurringServiceCreateSerializer
        return RecurringServiceSerializer
    
    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        """Pausar un servicio recurrente"""
        recurring_service = self.get_object()
        
        if recurring_service.status == 'paused':
            return Response(
                {'message': 'El servicio ya está pausado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recurring_service.status = 'paused'
        recurring_service.save()
        
        # Crear notificación
        ServiceNotification.objects.create(
            fk_user=request.user,
            fk_recurring_service=recurring_service,
            notification_type='recurring_paused',
            title='Servicio recurrente pausado',
            message=f'El servicio recurrente "{recurring_service.name}" ha sido pausado.'
        )
        
        return Response({'message': 'Servicio pausado exitosamente'})
    
    @action(detail=True, methods=['post'])
    def resume(self, request, pk=None):
        """Reanudar un servicio recurrente pausado"""
        recurring_service = self.get_object()
        
        if recurring_service.status != 'paused':
            return Response(
                {'message': 'El servicio no está pausado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recurring_service.status = 'active'
        recurring_service.save()
        
        return Response({'message': 'Servicio reanudado exitosamente'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancelar un servicio recurrente"""
        recurring_service = self.get_object()
        
        if recurring_service.status == 'cancelled':
            return Response(
                {'message': 'El servicio ya está cancelado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recurring_service.status = 'cancelled'
        recurring_service.save()
        
        # Crear notificación
        ServiceNotification.objects.create(
            fk_user=request.user,
            fk_recurring_service=recurring_service,
            notification_type='recurring_cancelled',
            title='Servicio recurrente cancelado',
            message=f'El servicio recurrente "{recurring_service.name}" ha sido cancelado.'
        )
        
        return Response({'message': 'Servicio cancelado exitosamente'})
    
    @action(detail=True, methods=['post'])
    def reactivate(self, request, pk=None):
        """Reactivar un servicio recurrente cancelado"""
        recurring_service = self.get_object()
        
        if recurring_service.status != 'cancelled':
            return Response(
                {'message': 'Solo se pueden reactivar servicios cancelados'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recurring_service.status = 'active'
        recurring_service.save()
        
        # Crear notificación
        ServiceNotification.objects.create(
            fk_user=request.user,
            fk_recurring_service=recurring_service,
            notification_type='recurring_reactivated',
            title='Servicio recurrente reactivado',
            message=f'El servicio recurrente "{recurring_service.name}" ha sido reactivado.'
        )
        
        return Response({'message': 'Servicio reactivado exitosamente'})
    
    @action(detail=True, methods=['post'])
    def generate_next_service(self, request, pk=None):
        """Generar manualmente el siguiente servicio"""
        recurring_service = self.get_object()
        
        if recurring_service.status != 'active':
            return Response(
                {'message': 'Solo se pueden generar servicios de servicios recurrentes activos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            new_service = recurring_service.generate_service()
            return Response({
                'message': 'Servicio generado exitosamente',
                'service': ServicesSerializer(new_service).data
            })
        except Exception as e:
            return Response(
                {'error': f'Error al generar servicio: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ServiceNotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para notificaciones de servicios.
    """
    queryset = ServiceNotification.objects.all()
    serializer_class = ServiceNotificationSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch', 'delete']  # Solo lectura, marcar como leída y eliminar
    
    def get_queryset(self):
        """Filtrar notificaciones por usuario"""
        return ServiceNotification.objects.filter(
            fk_user=self.request.user
        ).order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Marcar notificación como leída"""
        notification = self.get_object()
        notification.mark_as_read()
        return Response({'message': 'Notificación marcada como leída'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Marcar todas las notificaciones del usuario como leídas"""
        updated = ServiceNotification.objects.filter(
            fk_user=request.user,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())
        
        return Response({
            'message': f'{updated} notificaciones marcadas como leídas'
        })
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Obtener el número de notificaciones no leídas"""
        count = ServiceNotification.objects.filter(
            fk_user=request.user,
            is_read=False
        ).count()
        
        return Response({'unread_count': count})


@api_view(['POST'])
def generate_recurring_services(request):
    """
    Vista para generar servicios automáticamente desde servicios recurrentes.
    Esta vista se puede llamar desde un cron job o tarea programada.
    """
    today = timezone.now().date()
    
    # Obtener servicios recurrentes activos que necesitan generar servicios
    recurring_services = RecurringService.objects.filter(
        status='active',
        next_generation_date__lte=today
    )
    
    generated_count = 0
    errors = []
    
    for recurring_service in recurring_services:
        try:
            # Verificar si ya existe un servicio para esta fecha
            existing_service = Services.objects.filter(
                fk_clients=recurring_service.fk_client,
                fk_locations=recurring_service.fk_location,
                scheduled_date=recurring_service.next_generation_date
            ).exists()
            
            if not existing_service:
                new_service = recurring_service.generate_service()
                generated_count += 1
                
        except Exception as e:
            errors.append({
                'recurring_service_id': recurring_service.pk_recurring_service,
                'error': str(e)
            })
    
    response_data = {
        'generated_services': generated_count,
        'processed_recurring_services': len(recurring_services),
    }
    
    if errors:
        response_data['errors'] = errors
    
    return Response(response_data)
>>>>>>> Stashed changes
