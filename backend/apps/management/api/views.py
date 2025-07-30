from rest_framework import viewsets, generics
from rest_framework.parsers import MultiPartParser, FormParser
from apps.management.api.serializer import ManagementSerializer, ManagementUserSerializer, ManagementLocationsSerializer, ManagementWasteSerializer, CertificateSerializer, CollectorUserSerializer, CollectorUserUpdateSerializer
from apps.management.models import Management, ManagementUser, ManagementLocations, ManagementWaste, Certificate, CollectorUsers
# Register user, collector, management
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
#Update collector user by ID
from rest_framework.generics import RetrieveUpdateAPIView

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
    parser_classes = (MultiPartParser, FormParser) 

class CollectorUsersViewSet(viewsets.ModelViewSet):
    queryset = CollectorUsers.objects.all()
    serializer_class = CollectorUserSerializer

class CreateCollectorByManagementAPIView(APIView):
    def post(self, request, management_id):
        request.data['fk_management'] = management_id  # Inyecta el ID desde la URL
        serializer = CollectorUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Actualizar Collector User By ID
class CollectorUserUpdateAPIView(RetrieveUpdateAPIView):
    queryset = CollectorUsers.objects.all()
    serializer_class = CollectorUserUpdateSerializer
    http_method_names = ['get', 'patch']  # Solo permite GET y PATCH

# Create Location for ManagementLocations
class CreateManagementLocationAPIView(APIView):
    def post(self, request, management_id):
        request.data['fk_manageement'] = management_id
        serializer = ManagementLocationsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ManagementLocationsList(generics.ListAPIView):
    serializer_class = ManagementLocationsSerializer
    
    def get_queryset(self):
        management_id = self.kwargs['management_id']
        return ManagementLocations.objects.filter(
            fk_manageement_id=management_id,
            is_active=True
        ).select_related('fk_location')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Puedes personalizar la respuesta si lo necesitas
        response_data = {
            'management_id': kwargs['management_id'],
            'locations': serializer.data
        }
        
        return Response(response_data)