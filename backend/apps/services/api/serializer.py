from rest_framework import serializers
from django.utils import timezone
from apps.services.models import Status, TypeServices, Services, ServiceLog
from apps.client.api.serializer import ClientSerializer
from apps.core.api.serializer import LocationSerializer
from apps.waste.api.serializer import WasteSerializer, WasteSubCategorySerializer
from apps.accounts.api.serializers import UserListSerializer

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
        representation['fk_collector'] = UserListSerializer(instance.fk_collector).data if instance.fk_collector else None
        
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