from rest_framework import serializers
from apps.management.models import Management, ManagementUser, ManagementLocations, ManagementWaste, Certificate, CollectorUsers
from apps.accounts.models import User
from apps.accounts.api.serializers import UserRegisterSerializer
from apps.core.models import Location
from apps.core.api.serializer import LocationSerializer
from apps.management.models import ManagementLocations

class ManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Management
        fields = '__all__'
        #read_only_fields = ['pk_management', 'created_at', 'updated_at', 'is_active']

class ManagementUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagementUser
        fields = '__all__'
        read_only_fields = ['pk_management_user', 'created_at', 'updated_at', 'is_active']

class ManagementLocationsSerializer(serializers.ModelSerializer):
    fk_location = LocationSerializer()
    
    class Meta:
        model = ManagementLocations
        fields = ['fk_manageement', 'fk_location', 'is_main', 'pk_management_locations']
        # read_only_fields = ['pk_management_locations', 'created_at', 'updated_at', 'is_active']

    def create(self, validated_data):
        # Extract the nested location data
        location_data = validated_data.pop('fk_location')
        
        # Create or update the Location object
        location_serializer = LocationSerializer(data=location_data)
        location_serializer.is_valid(raise_exception=True)
        location = location_serializer.save()
        
        # Create the ManagementLocations object with the created location
        management_location = ManagementLocations.objects.create(
            fk_location=location,
            **validated_data
        )
        return management_location

    def update(self, instance, validated_data):
        # Handle location update if provided
        if 'fk_location' in validated_data:
            location_data = validated_data.pop('fk_location')
            location_serializer = LocationSerializer(instance.fk_location, data=location_data, partial=True)
            location_serializer.is_valid(raise_exception=True)
            location_serializer.save()
        
        # Update the ManagementLocations instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class ManagementWasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagementWaste
        fields = '__all__'
        read_only_fields = ('created_at',)
        #read_only_fields = ['pk_management_waste', 'created_at', 'updated_at', 'is_active']   

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = '__all__'
        #read_only_fields = ['pk_certificate', 'fk_management', 'created_at', 'updated_at', 'is_active']   

class CollectorUserSerializer(serializers.ModelSerializer):
    # ¡Clave! Usa 'fk_user' (nombre del campo en el modelo)
    fk_user = UserRegisterSerializer()

    class Meta:
        model = CollectorUsers
        fields = ['name', 'last_name', 'phone_number', 'fk_management', 'fk_user', 'pk_collector_user']

    def create(self, validated_data):
        # Extrae los datos del User
        user_data = validated_data.pop('fk_user')
        user_data['role'] = 'collector'  # Asigna el rol automáticamente
        
        # Crea el User primero
        user_serializer = UserRegisterSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            
            # Crea el CollectorUsers con la FK correcta
            collector = CollectorUsers.objects.create(
                fk_user=user,  # Usa el nombre exacto del campo (fk_user)
                **validated_data
            )
            return collector
        raise serializers.ValidationError(user_serializer.errors)

# Actualizar Collector User By ID
class CollectorUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectorUsers
        fields = ['name', 'last_name', 'phone_number']  # Solo campos editables
        extra_kwargs = {
            'name': {'required': False},  # Hace que los campos sean opcionales
            'last_name': {'required': False},
            'phone_number': {'required': False},
        }