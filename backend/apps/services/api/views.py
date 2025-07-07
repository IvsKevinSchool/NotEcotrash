from rest_framework import viewsets
from apps.services.api.serializer import StatusSerializer
from apps.services.models import Status

class StatusViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Status instances.
    """
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']