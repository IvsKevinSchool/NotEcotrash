from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse, Http404
from django.conf import settings
import os
from datetime import datetime

class GeneralBackupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        import subprocess
        backup_format = request.query_params.get('format', 'backup').lower()
        backup_dir = os.path.join(settings.BASE_DIR, 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        from datetime import datetime
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        db_name = settings.DATABASES['default']['NAME']
        db_user = settings.DATABASES['default']['USER']
        db_password = settings.DATABASES['default'].get('PASSWORD', '')
        db_host = settings.DATABASES['default'].get('HOST', 'localhost')
        db_port = settings.DATABASES['default'].get('PORT', '5432')
        env = os.environ.copy()
        env['PGPASSWORD'] = db_password
        if backup_format == 'sql':
            filename = f'backup_{timestamp}.sql'
            filepath = os.path.join(backup_dir, filename)
            cmd = f"pg_dump -U {db_user} -h {db_host} -p {db_port} -d {db_name} -F p -f {filepath}"
        else:
            filename = f'backup_{timestamp}.backup'
            filepath = os.path.join(backup_dir, filename)
            cmd = f"pg_dump -U {db_user} -h {db_host} -p {db_port} -d {db_name} -F c -f {filepath}"
        result = subprocess.run(cmd, shell=True, env=env)
        if result.returncode != 0 or not os.path.exists(filepath):
            raise Http404('Error al generar el backup')
        response = FileResponse(open(filepath, 'rb'), as_attachment=True, filename=filename)
        return response

class ClientesBackupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        import subprocess
        backup_format = request.query_params.get('format', 'backup').lower()
        backup_dir = os.path.join(settings.BASE_DIR, 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        from datetime import datetime
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        db_name = settings.DATABASES['default']['NAME']
        db_user = settings.DATABASES['default']['USER']
        db_password = settings.DATABASES['default'].get('PASSWORD', '')
        db_host = settings.DATABASES['default'].get('HOST', 'localhost')
        db_port = settings.DATABASES['default'].get('PORT', '5432')
        env = os.environ.copy()
        env['PGPASSWORD'] = db_password
        if backup_format == 'csv':
            filename = f'clientes_{timestamp}.csv'
            filepath = os.path.join(backup_dir, filename)
            table = 'client_client'  # Cambia esto si tu tabla tiene otro nombre
            cmd = f"psql -U {db_user} -h {db_host} -p {db_port} -d {db_name} -c \"\\COPY {table} TO '{filepath}' DELIMITER ',' CSV HEADER;\""
        else:
            filename = f'clientes_{timestamp}.backup'
            filepath = os.path.join(backup_dir, filename)
            table = 'client_client'
            # Backup solo de la tabla clientes en formato custom
            cmd = f"pg_dump -U {db_user} -h {db_host} -p {db_port} -d {db_name} -F c -t {table} -f {filepath}"
        result = subprocess.run(cmd, shell=True, env=env)
        if result.returncode != 0 or not os.path.exists(filepath):
            raise Http404('Error al generar el backup de clientes')
        response = FileResponse(open(filepath, 'rb'), as_attachment=True, filename=filename)
        return response
