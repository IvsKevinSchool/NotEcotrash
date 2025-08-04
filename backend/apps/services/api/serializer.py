from rest_framework import serializers
from django.utils import timezone
from apps.services.models import Status, TypeServices, Services, ServiceLog, RecurringService, ServiceNotification
from apps.client.api.serializer import ClientSerializer
from apps.core.api.serializer import LocationSerializer
from apps.waste.api.serializer import WasteSerializer, WasteSubCategorySerializer
from apps.management.api.serializer import ManagementSerializer

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'is_active')

class TypeServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeServices
        fields = '__all__'
        #read_only_fields = ('pk_type_services', 'fk_management')
        extra_kwargs = {
            'name': {'validators': []},  # Allow duplicate names for different managements
        }

class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = '__all__'
        read_only_fields = ('pk_services', 'service_number', 'created_at', 'updated_at')
        extra_kwargs = {
            'service_number': {'validators': []},  # Allow duplicate service numbers for different clients or locations
        }
    
    def create(self, validated_data):
        """
        Crear un servicio generando automáticamente el número de servicio.
        """
        # Generar número de servicio automáticamente
        import uuid
        from datetime import datetime
        
        # Generar un número único basado en timestamp y UUID corto
        timestamp = datetime.now().strftime('%Y%m%d%H%M')
        short_uuid = str(uuid.uuid4())[:8].upper()
        service_number = f"SRV-{timestamp}-{short_uuid}"
        
        validated_data['service_number'] = service_number
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)  # Obtiene la representación por defecto
        
        # Anidar objetos completos de las relaciones (usando sus propios serializers)
        representation['fk_clients'] = ClientSerializer(instance.fk_clients).data if instance.fk_clients else None
        representation['fk_locations'] = LocationSerializer(instance.fk_locations).data if instance.fk_locations else None
        representation['fk_status'] = StatusSerializer(instance.fk_status).data if instance.fk_status else None
        representation['fk_type_services'] = TypeServicesSerializer(instance.fk_type_services).data if instance.fk_type_services else None
        representation['fk_waste'] = WasteSerializer(instance.fk_waste).data if instance.fk_waste else None
        representation['fk_waste_subcategory'] = WasteSubCategorySerializer(instance.fk_waste_subcategory).data if instance.fk_waste_subcategory else None
        
        return representation
    
class ServiceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceLog
        fields = ['pk_service_log', 'completed_date', 'waste_amount', 'document', 'notes', 'fk_user', 'fk_services']
        read_only_fields = ('pk_service_log', 'completed_date')  # completed_date es solo lectura
    
    def validate_fk_user(self, value):
        """
        Validar que el usuario seleccionado sea un recolector activo.
        """
        if not value:
            raise serializers.ValidationError("Debe seleccionar un recolector.")
        
        if value.role != 'collector':
            raise serializers.ValidationError("El usuario seleccionado debe ser un recolector.")
        
        if not value.is_active:
            raise serializers.ValidationError("El recolector seleccionado no está activo.")
        
        return value
    
    def create(self, validated_data):
        """
        Crear una nueva bitácora estableciendo automáticamente la fecha/hora actual.
        """
        validated_data['completed_date'] = timezone.now()
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Anidar objetos completos de las relaciones
        representation['fk_services'] = ServicesSerializer(instance.fk_services).data if instance.fk_services else None
        representation['fk_user'] = {
            'id': instance.fk_user.id,
            'username': instance.fk_user.username,
            'full_name': instance.fk_user.get_full_name,
            'role': instance.fk_user.role
        } if instance.fk_user else None
        return representation


class RecurringServiceSerializer(serializers.ModelSerializer):
    """Serializer para servicios recurrentes"""
    
    class Meta:
        model = RecurringService
        fields = [
            'pk_recurring_service', 'name', 'fk_client', 'fk_management', 
            'fk_location', 'fk_type_service', 'fk_waste', 'fk_waste_subcategory',
            'frequency', 'custom_days', 'start_date', 'end_date', 
            'next_generation_date', 'status', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ('pk_recurring_service', 'created_at', 'updated_at')
    
    def validate(self, data):
        """Validaciones personalizadas"""
        # Si la frecuencia es personalizada, custom_days es requerido
        if data.get('frequency') == 'custom' and not data.get('custom_days'):
            raise serializers.ValidationError({
                'custom_days': 'Este campo es requerido cuando la frecuencia es personalizada.'
            })
        
        # Validar que end_date sea posterior a start_date
        if data.get('end_date') and data.get('start_date'):
            if data['end_date'] <= data['start_date']:
                raise serializers.ValidationError({
                    'end_date': 'La fecha de fin debe ser posterior a la fecha de inicio.'
                })
        
        return data
    
    def create(self, validated_data):
        """Crear servicio recurrente y establecer próxima fecha de generación"""
        # Si no se proporciona next_generation_date, usar start_date
        if 'next_generation_date' not in validated_data:
            validated_data['next_generation_date'] = validated_data['start_date']
        
        # Establecer el usuario que crea el servicio
        if 'created_by' not in validated_data:
            validated_data['created_by'] = self.context['request'].user
        
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Anidar objetos completos de las relaciones
        representation['fk_client'] = ClientSerializer(instance.fk_client).data if instance.fk_client else None
        representation['fk_management'] = ManagementSerializer(instance.fk_management).data if instance.fk_management else None
        representation['fk_location'] = LocationSerializer(instance.fk_location).data if instance.fk_location else None
        representation['fk_type_service'] = TypeServicesSerializer(instance.fk_type_service).data if instance.fk_type_service else None
        representation['fk_waste'] = WasteSerializer(instance.fk_waste).data if instance.fk_waste else None
        representation['fk_waste_subcategory'] = WasteSubCategorySerializer(instance.fk_waste_subcategory).data if instance.fk_waste_subcategory else None
        
        # Agregar información adicional útil
        representation['frequency_display'] = instance.get_frequency_display()
        representation['status_display'] = instance.get_status_display()
        
        return representation


class ServiceNotificationSerializer(serializers.ModelSerializer):
    """Serializer para notificaciones de servicios"""
    
    class Meta:
        model = ServiceNotification
        fields = [
            'pk_notification', 'fk_user', 'fk_service', 'fk_recurring_service',
            'notification_type', 'title', 'message', 'is_read', 'created_at', 'read_at'
        ]
        read_only_fields = ('pk_notification', 'created_at', 'read_at')
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Información básica del servicio (si existe)
        if instance.fk_service:
            representation['fk_service'] = {
                'pk_services': instance.fk_service.pk_services,
                'service_number': instance.fk_service.service_number,
                'scheduled_date': instance.fk_service.scheduled_date,
            }
        
        # Información básica del servicio recurrente (si existe)
        if instance.fk_recurring_service:
            representation['fk_recurring_service'] = {
                'pk_recurring_service': instance.fk_recurring_service.pk_recurring_service,
                'name': instance.fk_recurring_service.name,
                'frequency': instance.fk_recurring_service.get_frequency_display(),
            }
        
        # Tipo de notificación legible
        representation['notification_type_display'] = instance.get_notification_type_display()
        
        return representation


class RecurringServiceCreateSerializer(serializers.ModelSerializer):
    """Serializer simplificado para crear servicios recurrentes desde el frontend"""
    
    class Meta:
        model = RecurringService
        fields = [
            'name', 'fk_client', 'fk_location', 'fk_type_service', 
            'fk_waste', 'fk_waste_subcategory', 'frequency', 'custom_days', 
            'start_date', 'end_date', 'notes'
        ]
    
    def validate(self, data):
        """Validaciones para creación"""
        # Validar frecuencia personalizada
        if data.get('frequency') == 'custom' and not data.get('custom_days'):
            raise serializers.ValidationError({
                'custom_days': 'Debe especificar el número de días para la frecuencia personalizada.'
            })
        
        # Validar fechas
        if data.get('end_date') and data.get('start_date'):
            if data['end_date'] <= data['start_date']:
                raise serializers.ValidationError({
                    'end_date': 'La fecha de fin debe ser posterior a la fecha de inicio.'
                })
        
        return data
    
    def create(self, validated_data):
        """Crear servicio recurrente con valores por defecto"""
        # Obtener management del cliente
        client = validated_data['fk_client']
        validated_data['fk_management'] = client.fk_management
        
        # Establecer próxima fecha de generación
        validated_data['next_generation_date'] = validated_data['start_date']
        
        # Establecer usuario creador
        if self.context.get('request'):
            validated_data['created_by'] = self.context['request'].user
        
        return super().create(validated_data)