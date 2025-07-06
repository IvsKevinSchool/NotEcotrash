from rest_framework import serializers
from apps.management.models import Management

class ManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Management
        fields = '__all__'
        read_only_fields = ['pk_management', 'created_at', 'updated_at', 'is_active']   