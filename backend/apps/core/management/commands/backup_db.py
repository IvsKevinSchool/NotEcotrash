import os
from django.conf import settings
from django.core.management.base import BaseCommand
from datetime import datetime
import subprocess

class Command(BaseCommand):
    help = 'Genera un backup de la base de datos en formato .backup o .sql.'

    def add_arguments(self, parser):
        parser.add_argument('--format', type=str, default='backup', help='Formato del backup: backup o sql')
        parser.add_argument('--clientes', action='store_true', help='Solo backup de la tabla clientes en csv')

    def handle(self, *args, **options):
        backup_dir = os.path.join(settings.BASE_DIR, 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        fmt = options['format'].lower()
        clientes = options['clientes']
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        db_name = settings.DATABASES['default']['NAME']
        db_user = settings.DATABASES['default']['USER']
        db_host = settings.DATABASES['default'].get('HOST', 'localhost')
        db_port = settings.DATABASES['default'].get('PORT', '5432')

        if clientes:
            # Backup de la tabla clientes en CSV
            filename = f'clientes_{timestamp}.csv'
            filepath = os.path.join(backup_dir, filename)
            table = 'client_client'  # Cambia esto si tu tabla tiene otro nombre
            cmd = f"psql -U {db_user} -h {db_host} -p {db_port} -d {db_name} -c \"\\COPY {table} TO '{filepath}' DELIMITER ',' CSV HEADER;\""
        else:
            if fmt == 'sql':
                filename = f'backup_{timestamp}.sql'
                filepath = os.path.join(backup_dir, filename)
                cmd = f"pg_dump -U {db_user} -h {db_host} -p {db_port} -d {db_name} -F p -f {filepath}"
            else:
                filename = f'backup_{timestamp}.backup'
                filepath = os.path.join(backup_dir, filename)
                cmd = f"pg_dump -U {db_user} -h {db_host} -p {db_port} -d {db_name} -F c -f {filepath}"

        self.stdout.write(f"Ejecutando: {cmd}")
        result = subprocess.run(cmd, shell=True)
        if result.returncode == 0:
            self.stdout.write(self.style.SUCCESS(f'Backup generado: {filepath}'))
        else:
            self.stdout.write(self.style.ERROR('Error al generar el backup'))
