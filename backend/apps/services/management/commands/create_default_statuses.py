from django.core.management.base import BaseCommand
from apps.services.models import Status

class Command(BaseCommand):
    help = 'Create default service statuses'

    def handle(self, *args, **options):
        statuses = [
            {'name': 'Pendiente', 'description': 'Servicio pendiente de ejecución'},
            {'name': 'En Proceso', 'description': 'Servicio en ejecución'},
            {'name': 'Completado', 'description': 'Servicio completado exitosamente'},
            {'name': 'Cancelado', 'description': 'Servicio cancelado'},
        ]

        created_count = 0
        for status_data in statuses:
            status, created = Status.objects.get_or_create(
                name=status_data['name'],
                defaults={'description': status_data['description']}
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created status: {status.name}')
                )
            else:
                self.stdout.write(f'Status already exists: {status.name}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} new statuses')
        )
