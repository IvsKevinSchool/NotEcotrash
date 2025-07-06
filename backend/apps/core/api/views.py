from rest_framework import viewsets
from apps.core.api.serializer import LocationSerializer
from apps.core.models import Location

class LocationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing locations.
    Provides CRUD operations for the Location model.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']  # Specify allowed HTTP methods