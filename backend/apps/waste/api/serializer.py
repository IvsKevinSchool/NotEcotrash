from rest_framework import serializers
from apps.waste.models import Waste

class WasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waste
        fields = '__all__'
        read_only_fields = ['pk_waste', 'created_at', 'update_at', 'is_active']