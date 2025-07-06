from rest_framework import viewsets
from apps.management.api.serializer import ManagementSerializer
from apps.management.models import Management

class ManagementViewSet(viewsets.ModelViewSet):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']