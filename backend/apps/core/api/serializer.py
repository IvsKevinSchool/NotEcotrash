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
    
    def validate_interior_number(self, value):
        """Convert empty string to None for interior_number"""
        if value == '' or value is None:
            return None
        try:
            return int(value)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Interior number must be a valid integer or empty.")
    
    def validate_exterior_number(self, value):
        """Convert empty string to None for exterior_number"""
        if value == '' or value is None:
            return None
        try:
            return int(value)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Exterior number must be a valid integer.")
    
    def validate_postcode(self, value):
        """Handle empty postcode"""
        if value == '':
            return None
        return value

class LocationForServiceSerializer(serializers.ModelSerializer):
    """
    Serializer for locations in service forms.
    Includes associated client information for filtering.
    """
    client_ids = serializers.SerializerMethodField()
    
    class Meta:
        model = Location
        fields = ['pk_location', 'name', 'city', 'state', 'client_ids']
    
    def get_client_ids(self, obj):
        """Return the IDs of clients associated with this location."""
        from apps.client.models import ClientsLocations
        client_locations = ClientsLocations.objects.filter(fk_location=obj)
        return [cl.fk_client.pk_client for cl in client_locations]