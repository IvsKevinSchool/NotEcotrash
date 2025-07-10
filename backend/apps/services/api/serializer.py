from rest_framework import serializers
from apps.services.models import Status, TypeServices, Services
from apps.client.api.serializer import ClientSerializer
from apps.core.api.serializer import LocationSerializer
from apps.waste.api.serializer import WasteSerializer, WasteSubCategorySerializer

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
        read_only_fields = ('pk_services', 'created_at', 'updated_at')
        extra_kwargs = {
            'service_number': {'validators': []},  # Allow duplicate service numbers for different clients or locations
        }
    
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
