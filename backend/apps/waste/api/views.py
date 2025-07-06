from rest_framework import viewsets
from apps.waste.api.serializer import WasteSerializer
from apps.waste.models import Waste

class WasteViewSet(viewsets.ModelViewSet):
    queryset = Waste.objects.all()
    serializer_class = WasteSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']