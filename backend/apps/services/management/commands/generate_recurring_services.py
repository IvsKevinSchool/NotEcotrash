from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.services.models import RecurringService
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Genera servicios automáticamente desde servicios recurrentes activos'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Ejecutar en modo de prueba sin crear servicios reales',
        )
        parser.add_argument(
            '--days-ahead',
            type=int,
            default=0,
            help='Generar servicios para los próximos N días (por defecto: 0, solo hoy)',
        )
    
    def handle(self, *args, **options):
        dry_run = options['dry_run']
        days_ahead = options['days_ahead']
        
        today = timezone.now().date()
        target_date = today + timedelta(days=days_ahead)
        
        self.stdout.write(
            self.style.SUCCESS(f'Iniciando generación de servicios para: {target_date}')
        )
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING('MODO DE PRUEBA - No se crearán servicios reales')
            )
        
        # Obtener servicios recurrentes activos que necesitan generar servicios
        recurring_services = RecurringService.objects.filter(
            status='active',
            next_generation_date__lte=target_date
        )
        
        generated_count = 0
        skipped_count = 0
        error_count = 0
        
        for recurring_service in recurring_services:
            try:
                # Verificar si ya existe un servicio para esta fecha
                from apps.services.models import Services
                
                existing_service = Services.objects.filter(
                    fk_clients=recurring_service.fk_client,
                    fk_locations=recurring_service.fk_location,
                    scheduled_date=recurring_service.next_generation_date
                ).exists()
                
                if existing_service:
                    self.stdout.write(
                        self.style.WARNING(
                            f'Saltando {recurring_service.name} - Ya existe servicio para {recurring_service.next_generation_date}'
                        )
                    )
                    skipped_count += 1
                    continue
                
                if not dry_run:
                    new_service = recurring_service.generate_service()
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Generado servicio #{new_service.service_number} desde "{recurring_service.name}"'
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'[DRY-RUN] Se generaría servicio desde "{recurring_service.name}" para {recurring_service.next_generation_date}'
                        )
                    )
                
                generated_count += 1
                
            except Exception as e:
                error_count += 1
                logger.error(f'Error generando servicio desde {recurring_service.name}: {str(e)}')
                self.stdout.write(
                    self.style.ERROR(
                        f'Error en "{recurring_service.name}": {str(e)}'
                    )
                )
        
        # Resumen
        self.stdout.write(
            self.style.SUCCESS(f'\n--- RESUMEN ---')
        )
        self.stdout.write(f'Servicios recurrentes procesados: {len(recurring_services)}')
        self.stdout.write(f'Servicios generados: {generated_count}')
        self.stdout.write(f'Servicios saltados (ya existían): {skipped_count}')
        self.stdout.write(f'Errores: {error_count}')
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING('Ejecutar sin --dry-run para crear los servicios realmente')
            )
