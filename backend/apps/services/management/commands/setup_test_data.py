from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from apps.services.models import RecurringService, Status, TypeServices
from apps.client.models import Client
from apps.core.models import Location
from apps.management.models import Management
from apps.waste.models import Waste, WasteSubCategory


class Command(BaseCommand):
    help = 'Crea datos de prueba para servicios recurrentes'
    
    def handle(self, *args, **options):
        try:
            # Obtener datos existentes
            client = Client.objects.first()
            management = Management.objects.first()
            location = Location.objects.first()
            
            if not client:
                self.stdout.write(self.style.ERROR('No se encontró ningún cliente'))
                return
            
            if not management:
                self.stdout.write(self.style.ERROR('No se encontró ningún management'))
                return
            
            if not location:
                self.stdout.write(self.style.ERROR('No se encontró ninguna ubicación'))
                return
            
            # Crear o obtener tipo de servicio
            type_service, created = TypeServices.objects.get_or_create(
                name='Recolección General',
                fk_management=management,
                defaults={'description': 'Servicio de recolección general de residuos'}
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Tipo de servicio creado: {type_service.name}'))
            
            # Crear o obtener residuo (opcional)
            waste = Waste.objects.first()
            waste_subcategory = WasteSubCategory.objects.first()
            
            # Crear servicios recurrentes de prueba
            today = timezone.now().date()
            
            # Servicio diario
            daily_service, created = RecurringService.objects.get_or_create(
                name='Recolección Diaria - Oficina Principal',
                fk_client=client,
                fk_management=management,
                fk_location=location,
                fk_type_service=type_service,
                frequency='daily',
                defaults={
                    'start_date': today,
                    'next_generation_date': today,
                    'fk_waste': waste,
                    'fk_waste_subcategory': waste_subcategory,
                    'notes': 'Servicio de recolección diaria para oficina principal',
                    'status': 'active'
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Servicio diario creado: {daily_service.name}'))
            
            # Servicio semanal
            weekly_service, created = RecurringService.objects.get_or_create(
                name='Recolección Semanal - Almacén',
                fk_client=client,
                fk_management=management,
                fk_location=location,
                fk_type_service=type_service,
                frequency='weekly',
                defaults={
                    'start_date': today,
                    'next_generation_date': today,
                    'fk_waste': waste,
                    'fk_waste_subcategory': waste_subcategory,
                    'notes': 'Servicio de recolección semanal para almacén',
                    'status': 'active'
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Servicio semanal creado: {weekly_service.name}'))
            
            # Servicio personalizado (cada 3 días)
            custom_service, created = RecurringService.objects.get_or_create(
                name='Recolección Personalizada - Área Producción',
                fk_client=client,
                fk_management=management,
                fk_location=location,
                fk_type_service=type_service,
                frequency='custom',
                custom_days=3,
                defaults={
                    'start_date': today,
                    'next_generation_date': today,
                    'fk_waste': waste,
                    'fk_waste_subcategory': waste_subcategory,
                    'notes': 'Servicio de recolección cada 3 días para área de producción',
                    'status': 'active'
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Servicio personalizado creado: {custom_service.name}'))
            
            # Crear estados básicos si no existen
            status_pending, created = Status.objects.get_or_create(
                name='Pendiente',
                defaults={'description': 'Servicio pendiente de aprobación'}
            )
            
            status_approved, created = Status.objects.get_or_create(
                name='Aprobado',
                defaults={'description': 'Servicio aprobado y programado'}
            )
            
            status_completed, created = Status.objects.get_or_create(
                name='Completado',
                defaults={'description': 'Servicio completado exitosamente'}
            )
            
            self.stdout.write(self.style.SUCCESS('\n--- RESUMEN ---'))
            self.stdout.write(f'Cliente: {client}')
            self.stdout.write(f'Management: {management}')
            self.stdout.write(f'Ubicación: {location}')
            self.stdout.write(f'Tipo de Servicio: {type_service.name}')
            self.stdout.write(f'Servicios recurrentes en BD: {RecurringService.objects.count()}')
            self.stdout.write(f'Estados en BD: {Status.objects.count()}')
            
            self.stdout.write(self.style.SUCCESS('\n¡Datos de prueba creados exitosamente!'))
            self.stdout.write('Puedes probar:')
            self.stdout.write('1. python manage.py generate_recurring_services --dry-run')
            self.stdout.write('2. Acceder al frontend y ver los servicios recurrentes')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creando datos de prueba: {str(e)}'))
            import traceback
            traceback.print_exc()
