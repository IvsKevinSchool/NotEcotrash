from rest_framework import serializers
from apps.services.models import Status, TypeServices, Services

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
