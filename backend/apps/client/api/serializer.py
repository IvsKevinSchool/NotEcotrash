from rest_framework import serializers
from apps.client.models import Client, ClientsLocations, ClientsUsers

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields= '__all__'
        #read_only_fields = ['pk_client', 'fk_management', 'created_at', 'updatet_at', 'is_active']
        
class ClientsLocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientsLocations
        fields= '__all__'
        read_only_fields = ['pk_client_location', 'fk_client', 'fk_location']

class ClientsUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientsUsers
        fields= '__all__'
        read_only_fields = ['pk_client_user','fk_client', 'fk_user']
