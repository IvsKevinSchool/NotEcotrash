from rest_framework import serializers
from apps.services.models import Status
from apps.services.models import TypeServices
class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'is_active')


class TypeServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeServices
        fields = '__all__'