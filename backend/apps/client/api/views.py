from rest_framework import viewsets
from apps.client.api.serializer import ClientSerializer, ClientsLocationsSerializer, ClientsUsersSerializer
from apps.client.models import Client, ClientsLocations, ClientsUsers

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class ClientsLocationsViewSet(viewsets.ModelViewSet):
    queryset = ClientsLocations.objects.all()
    serializer_class = ClientsLocationsSerializer

class ClientsUsersViewSet(viewsets.ModelViewSet):
    queryset = ClientsUsers.objects.all()
    serializer_class = ClientsUsersSerializer