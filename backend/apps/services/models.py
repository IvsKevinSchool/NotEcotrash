from django.db import models
from apps.management.models import Management
from apps.core.models import Location
from apps.client.models import Client
from apps.waste.models import Waste, WasteSubCategory
from apps.accounts.models import User
from django.core.validators import MinValueValidator
from datetime import date, datetime, timedelta  # Para validar fechas
from django.utils import timezone


# Create your models here.
class Status(models.Model):
    pk_status = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class TypeServices(models.Model):
    pk_type_services = models.AutoField(primary_key=True)
    fk_management = models.ForeignKey(Management, on_delete=models.CASCADE, related_name='type_services')

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Services(models.Model):
    pk_services = models.AutoField(primary_key=True, verbose_name="ID Servicio")
    
    service_number = models.CharField(max_length=50, unique=True, verbose_name="Número de Servicio")
    scheduled_date = models.DateField(
        validators=[MinValueValidator(date.today())],  # Fecha futura o igual a hoy
        verbose_name="Fecha Programada"
    )
    
    fk_clients = models.ForeignKey(
        Client,  # Asume que existe un modelo Clients
        on_delete=models.PROTECT,  # Evita borrar si hay servicios asociados
        verbose_name="Cliente"
    )
    fk_locations = models.ForeignKey(
        Location,  # Modelo Locations
        on_delete=models.PROTECT,
        verbose_name="Ubicación"
    )
    fk_status = models.ForeignKey(
        Status,  # Modelo Status (ej: "Pendiente", "Completado")
        on_delete=models.PROTECT,
        verbose_name="Estado"
    )
    fk_type_services = models.ForeignKey(
        TypeServices,  # Modelo TypeServices
        on_delete=models.PROTECT,
        verbose_name="Tipo de Servicio"
    )
    fk_waste = models.ForeignKey(
        Waste,  # Modelo Waste (Residuos)
        on_delete=models.PROTECT,
        verbose_name="Residuo",
        null=True,  # Permitir valores nulos
        blank=True  # Permitir campos vacíos en formularios
    )
    fk_waste_subcategory = models.ForeignKey(
        WasteSubCategory,  # Modelo WasteSubcategory
        on_delete=models.PROTECT,
        verbose_name="Subcategoría de Residuo",
        null=True,  # Permitir valores nulos
        blank=True  # Permitir campos vacíos en formularios
    )
    
    class Meta:
        verbose_name = "Servicio"
        verbose_name_plural = "Servicios"
        ordering = ['-scheduled_date']  # Ordenar por fecha descendente
    
    def __str__(self):
        return f"Servicio #{self.service_number} - {self.fk_clients}"

class ServiceLog(models.Model):
    pk_service_log = models.AutoField(primary_key=True)
    completed_date = models.DateTimeField()
    waste_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    document = models.FileField(upload_to='service_logs/', blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    fk_user = models.ForeignKey(
        User,  # Asume que hay un modelo Collector
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    fk_services = models.ForeignKey(
        'Services',  # Asume que hay un modelo Service
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'ServiceLog'
        verbose_name = 'Service Log'
        verbose_name_plural = 'Service Logs'

    def __str__(self):
        return f"ServiceLog {self.pk_service_log} - {self.completed_date}"


class RecurringService(models.Model):
    """Modelo para servicios recurrentes programados por el cliente"""
    
    FREQUENCY_CHOICES = [
        ('daily', 'Diario'),
        ('weekly', 'Semanal'),
        ('monthly', 'Mensual'),
        ('custom', 'Personalizado'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Activo'),
        ('paused', 'Pausado'),
        ('cancelled', 'Cancelado'),
    ]
    
    pk_recurring_service = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, verbose_name="Nombre del Servicio Recurrente")
    
    # Relaciones
    fk_client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        verbose_name="Cliente",
        related_name="recurring_services"
    )
    fk_management = models.ForeignKey(
        Management,
        on_delete=models.CASCADE,
        verbose_name="Management",
        related_name="recurring_services"
    )
    fk_location = models.ForeignKey(
        Location,
        on_delete=models.PROTECT,
        verbose_name="Ubicación"
    )
    fk_type_service = models.ForeignKey(
        TypeServices,
        on_delete=models.PROTECT,
        verbose_name="Tipo de Servicio"
    )
    fk_waste = models.ForeignKey(
        Waste,
        on_delete=models.PROTECT,
        verbose_name="Residuo",
        blank=True,
        null=True
    )
    fk_waste_subcategory = models.ForeignKey(
        WasteSubCategory,
        on_delete=models.PROTECT,
        verbose_name="Subcategoría de Residuo",
        blank=True,
        null=True
    )
    
    # Configuración de recurrencia
    frequency = models.CharField(
        max_length=10,
        choices=FREQUENCY_CHOICES,
        verbose_name="Frecuencia"
    )
    custom_days = models.PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name="Días personalizados",
        help_text="Solo para frecuencia personalizada"
    )
    
    # Fechas
    start_date = models.DateField(verbose_name="Fecha de inicio")
    end_date = models.DateField(
        blank=True,
        null=True,
        verbose_name="Fecha de fin (opcional)"
    )
    next_generation_date = models.DateField(
        verbose_name="Próxima fecha de generación"
    )
    
    # Estado
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name="Estado"
    )
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_recurring_services'
    )
    
    # Notas adicionales
    notes = models.TextField(blank=True, null=True, verbose_name="Notas")
    
    class Meta:
        verbose_name = "Servicio Recurrente"
        verbose_name_plural = "Servicios Recurrentes"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.fk_client} ({self.get_frequency_display()})"
    
    def calculate_next_date(self):
        """Calcula la próxima fecha de generación según la frecuencia"""
        if self.frequency == 'daily':
            return self.next_generation_date + timedelta(days=1)
        elif self.frequency == 'weekly':
            return self.next_generation_date + timedelta(weeks=1)
        elif self.frequency == 'monthly':
            # Aproximación de mes (30 días)
            return self.next_generation_date + timedelta(days=30)
        elif self.frequency == 'custom' and self.custom_days:
            return self.next_generation_date + timedelta(days=self.custom_days)
        return self.next_generation_date
    
    def generate_service(self):
        """Genera un nuevo servicio basado en este servicio recurrente"""
        # Generar número de servicio único por management
        last_service = Services.objects.filter(
            fk_management=self.fk_management
        ).order_by('-pk_services').first()
        
        if last_service:
            # Extraer número del último servicio y incrementar
            try:
                last_number = int(last_service.service_number.split('-')[-1])
                new_number = f"{self.fk_management.pk_management}-{last_number + 1:06d}"
            except:
                new_number = f"{self.fk_management.pk_management}-000001"
        else:
            new_number = f"{self.fk_management.pk_management}-000001"
        
        # Obtener estado "Pendiente" por defecto
        pending_status = Status.objects.filter(name__icontains='pendiente').first()
        if not pending_status:
            pending_status = Status.objects.create(
                name='Pendiente',
                description='Servicio pendiente de aprobación'
            )
        
        # Crear el nuevo servicio
        new_service = Services.objects.create(
            service_number=new_number,
            scheduled_date=self.next_generation_date,
            fk_management=self.fk_management,
            fk_clients=self.fk_client,
            fk_locations=self.fk_location,
            fk_status=pending_status,
            fk_type_services=self.fk_type_service,
            fk_waste=self.fk_waste,
            fk_waste_subcategory=self.fk_waste_subcategory,
        )
        
        # Crear notificación para el management
        ServiceNotification.objects.create(
            fk_service=new_service,
            fk_recurring_service=self,
            fk_user=self.fk_management.managementuser_set.first().fk_user if self.fk_management.managementuser_set.exists() else None,
            notification_type='new_service',
            title='Nuevo servicio generado automáticamente',
            message=f'Se ha generado automáticamente el servicio #{new_service.service_number} para {self.fk_client}.',
        )
        
        # Actualizar próxima fecha de generación
        self.next_generation_date = self.calculate_next_date()
        self.save()
        
        return new_service


class ServiceNotification(models.Model):
    """Modelo para notificaciones in-app relacionadas con servicios"""
    
    NOTIFICATION_TYPES = [
        ('new_service', 'Nuevo Servicio'),
        ('service_approved', 'Servicio Aprobado'),
        ('service_rejected', 'Servicio Rechazado'),
        ('service_completed', 'Servicio Completado'),
        ('recurring_paused', 'Recurrencia Pausada'),
        ('recurring_cancelled', 'Recurrencia Cancelada'),
    ]
    
    pk_notification = models.AutoField(primary_key=True)
    
    # Relaciones
    fk_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Usuario destinatario",
        related_name="service_notifications"
    )
    fk_service = models.ForeignKey(
        Services,
        on_delete=models.CASCADE,
        verbose_name="Servicio relacionado",
        blank=True,
        null=True
    )
    fk_recurring_service = models.ForeignKey(
        RecurringService,
        on_delete=models.CASCADE,
        verbose_name="Servicio recurrente relacionado",
        blank=True,
        null=True
    )
    
    # Contenido de la notificación
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
        verbose_name="Tipo de notificación"
    )
    title = models.CharField(max_length=200, verbose_name="Título")
    message = models.TextField(verbose_name="Mensaje")
    
    # Estado
    is_read = models.BooleanField(default=False, verbose_name="Leída")
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Notificación de Servicio"
        verbose_name_plural = "Notificaciones de Servicios"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.fk_user.username}"
    
    def mark_as_read(self):
        """Marca la notificación como leída"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()