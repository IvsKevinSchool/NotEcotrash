from rest_framework import serializers
from apps.management.models import Management, ManagementUser, ManagementLocations, ManagementWaste, Certificate, CollectorUsers
from apps.accounts.models import User
from apps.accounts.api.serializers import UserRegisterSerializer

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
    class Meta:
        model = ManagementLocations
        fields = '__all__'
        read_only_fields = ['pk_management_locations', 'created_at', 'updated_at', 'is_active']

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