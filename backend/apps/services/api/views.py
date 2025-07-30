from rest_framework import viewsets
from apps.services.models import Status, TypeServices, Services
from apps.management.models import Management
from apps.services.api.serializer import StatusSerializer, TypeServicesSerializer, ServicesSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import subprocess
import os
import psycopg2
import datetime
import csv
from rest_framework.views import APIView

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

