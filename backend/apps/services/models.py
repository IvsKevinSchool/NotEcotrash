from django.db import models
from apps.management.models import Management
from apps.core.models import Location
from apps.client.models import Client
from apps.waste.models import Waste, WasteSubCategory
from apps.accounts.models import User
from django.core.validators import MinValueValidator
from datetime import date  # Para validar fechas


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
        verbose_name="Residuo"
    )
    fk_waste_subcategory = models.ForeignKey(
        WasteSubCategory,  # Modelo WasteSubcategory
        on_delete=models.PROTECT,
        verbose_name="Subcategoría de Residuo"
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
        return f"ServiceLog {self.pk_record} - {self.completed_date}"