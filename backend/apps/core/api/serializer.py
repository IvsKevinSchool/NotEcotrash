from rest_framework import serializers
from apps.core.models import Location

class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Location model.
    This serializer is used to convert Location instances to JSON format and vice versa.
    """
    
    class Meta:
        model = Location
        fields = '__all__'  # Include all fields from the Location model
        #read_only_fields = ['pk_location', 'created_at', 'updated_at', 'is_active']  # Make these fields read-only