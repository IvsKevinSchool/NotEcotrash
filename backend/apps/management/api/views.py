from rest_framework import viewsets
from apps.management.api.serializer import ManagementSerializer, ManagementUserSerializer, ManagementLocationsSerializer, ManagementWasteSerializer, CertificateSerializer
from apps.management.models import Management, ManagementUser, ManagementLocations, ManagementWaste, Certificate

class ManagementViewSet(viewsets.ModelViewSet):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    
class ManagementUserViewSet(viewsets.ModelViewSet):
    queryset = ManagementUser.objects.all()
    serializer_class = ManagementUserSerializer

class ManagementLocationsViewSet(viewsets.ModelViewSet):
    queryset = ManagementLocations.objects.all()
    serializer_class = ManagementLocationsSerializer

class ManagementWasteViewSet(viewsets.ModelViewSet):
    queryset = ManagementWaste.objects.all()
    serializer_class = ManagementWasteSerializer

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
