from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.client.models import Client
from apps.client.api.serializer import ClientSerializer

class ClientsByManagerAPIView(APIView):
    """
    Endpoint para obtener todos los clientes de un manager específico.
    URL: /api/client/by-management/<int:management_id>/
    """
    def get(self, request, management_id):
        clients = Client.objects.filter(fk_management=management_id)
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)