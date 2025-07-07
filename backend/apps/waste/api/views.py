from rest_framework import viewsets
from apps.waste.api.serializer import WasteSerializer, WasteSubCategorySerializer
from apps.waste.models import Waste, WasteSubCategory

class WasteViewSet(viewsets.ModelViewSet):
    queryset = Waste.objects.all()
    serializer_class = WasteSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class WasteSubCategoryViewSet(viewsets.ModelViewSet):
    queryset = WasteSubCategory.objects.all()
    serializer_class = WasteSubCategorySerializer