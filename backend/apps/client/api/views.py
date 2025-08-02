from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.client.api.serializer import ClientSerializer, ClientsLocationsSerializer, ClientsUsersSerializer, ClientLocationCreateSerializer, CertificateSerializer
from apps.client.models import Client, ClientsLocations, ClientsUsers, Certificate

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class ClientsLocationsViewSet(viewsets.ModelViewSet):
    queryset = ClientsLocations.objects.all()
    serializer_class = ClientsLocationsSerializer

class ClientLocationCreateAPIView(APIView):
    """
    Vista para crear ubicaciones de clientes con datos anidados.
    POST /client/<int:client_id>/locations/
    """
    def post(self, request, client_id):
        try:
            client = Client.objects.get(pk_client=client_id)
        except Client.DoesNotExist:
            return Response(
                {'error': f'Cliente con ID {client_id} no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Agregar el cliente a los datos
        request.data['fk_client'] = client_id
        
        serializer = ClientLocationCreateSerializer(data=request.data)
        if serializer.is_valid():
            client_location = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, client_id, location_id):
        """
        Actualizar una ubicación específica de un cliente.
        PATCH /client/<int:client_id>/locations/<int:location_id>/
        """
        try:
            client_location = ClientsLocations.objects.get(
                pk_client_location=location_id,
                fk_client_id=client_id
            )
        except ClientsLocations.DoesNotExist:
            return Response(
                {'error': 'Ubicación del cliente no encontrada'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ClientLocationCreateSerializer(
            client_location, 
            data=request.data, 
            partial=True
        )
        if serializer.is_valid():
            updated_location = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClientLocationsList(generics.ListAPIView):
    """
    Vista para listar todas las ubicaciones de un cliente específico.
    GET /client/<int:client_id>/locations/
    """
    serializer_class = ClientLocationCreateSerializer
    
    def get_queryset(self):
        client_id = self.kwargs['client_id']
        return ClientsLocations.objects.filter(
            fk_client_id=client_id
        ).select_related('fk_location', 'fk_client')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        response_data = {
            'client_id': kwargs['client_id'],
            'locations': serializer.data
        }
        
        return Response(response_data)

class AllClientLocationsForManagement(generics.ListAPIView):
    """
    Vista para listar todas las ubicaciones de todos los clientes de un management.
    GET /client/management/<int:management_id>/all-locations/
    """
    serializer_class = ClientLocationCreateSerializer
    
    def get_queryset(self):
        management_id = self.kwargs['management_id']
        return ClientsLocations.objects.filter(
            fk_client__fk_management_id=management_id
        ).select_related('fk_location', 'fk_client')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        response_data = {
            'management_id': kwargs['management_id'],
            'locations': serializer.data
        }
        
        return Response(response_data)

class ClientsUsersViewSet(viewsets.ModelViewSet):
    queryset = ClientsUsers.objects.all()
    serializer_class = ClientsUsersSerializer

from rest_framework.parsers import MultiPartParser, FormParser
class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    parser_classes = (MultiPartParser, FormParser)

from rest_framework.generics import ListAPIView
class CertificatesByClientAPIView(ListAPIView):
    """
    Endpoint para listar certificados por cliente.
    GET /client/<int:client_id>/certificates/
    """
    serializer_class = CertificateSerializer

    def get_queryset(self):
        client_id = self.kwargs['client_id']
        return Certificate.objects.filter(fk_client_id=client_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {
            'client_id': kwargs['client_id'],
            'certificates': serializer.data
        }
        return Response(response_data)