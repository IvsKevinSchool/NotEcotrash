from rest_framework import serializers
from apps.management.models import Management, ManagementUser, ManagementLocations, ManagementWaste, Certificate

class ManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Management
        fields = '__all__'
        read_only_fields = ['pk_management', 'created_at', 'updated_at', 'is_active']

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
        read_only_fields = ['pk_management_waste', 'created_at', 'updated_at', 'is_active']   

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = '__all__'
        read_only_fields = ['pk_certificate', 'fk_management', 'created_at', 'updated_at', 'is_active']   