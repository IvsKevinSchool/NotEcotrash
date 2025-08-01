from rest_framework import serializers
from apps.client.models import Client, ClientsLocations, ClientsUsers, Certificate
from apps.core.models import Location
from apps.core.api.serializer import LocationSerializer

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields= '__all__'
        #read_only_fields = ['pk_client', 'fk_management', 'created_at', 'updatet_at', 'is_active']
        
class ClientsLocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientsLocations
        fields= '__all__'
        read_only_fields = ['pk_client_location', 'fk_client', 'fk_location']

class ClientLocationCreateSerializer(serializers.ModelSerializer):
    fk_location = LocationSerializer()
    client_name = serializers.CharField(source='fk_client.name', read_only=True)
    
    class Meta:
        model = ClientsLocations
        fields = ['fk_client', 'fk_location', 'is_main', 'pk_client_location', 'client_name']
        read_only_fields = ['pk_client_location', 'client_name']

    def create(self, validated_data):
        # Extraer los datos de ubicación anidados
        location_data = validated_data.pop('fk_location')
        
        # Crear la ubicación primero
        location_serializer = LocationSerializer(data=location_data)
        location_serializer.is_valid(raise_exception=True)
        location = location_serializer.save()
        
        # Crear la relación ClientsLocations con la ubicación creada
        client_location = ClientsLocations.objects.create(
            fk_location=location,
            **validated_data
        )
        return client_location

    def update(self, instance, validated_data):
        # Manejar actualización de ubicación si se proporciona
        if 'fk_location' in validated_data:
            location_data = validated_data.pop('fk_location')
            location_serializer = LocationSerializer(instance.fk_location, data=location_data, partial=True)
            location_serializer.is_valid(raise_exception=True)
            location_serializer.save()
        
        # Actualizar la instancia ClientsLocations
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class ClientsUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientsUsers
        fields= '__all__'
        read_only_fields = ['pk_client_user','fk_client', 'fk_user']

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = '__all__'