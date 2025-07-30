from rest_framework import viewsets
from apps.services.models import Status, TypeServices, Services
from apps.management.models import Management
from apps.services.api.serializer import StatusSerializer, TypeServicesSerializer, ServicesSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import subprocess
import os
import datetime
from rest_framework.views import APIView

@api_view(['POST'])
def backup_database(request):
    db = settings.DATABASES['default']
    db_name = db['NAME']
    db_user = db['USER']
    db_password = db['PASSWORD']
    db_host = db.get('HOST', 'localhost')
    db_port = db.get('PORT', '5432')

    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = os.path.join(settings.BASE_DIR, 'backups')
    os.makedirs(backup_dir, exist_ok=True)
    backup_file = os.path.join(backup_dir, f'backup_{timestamp}.backup')

    try:
        subprocess.run(
            [
                'pg_dump',
                '-h', db_host,
                '-p', str(db_port),
                '-U', db_user,
                '-F', 'c',
                '-f', backup_file,
                db_name
            ],
            env={**os.environ, 'PGPASSWORD': db_password},
            check=True
        )
        return Response({'message': f'Backup creado en: {backup_file}'}, status=status.HTTP_201_CREATED)
    except subprocess.CalledProcessError as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StatusViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Status instances.
    """
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class TypeServicesViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing TypeServices instances.
    """
    queryset = TypeServices.objects.all()
    serializer_class = TypeServicesSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class ServicesViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Services instances.
    """
    queryset = Services.objects.all()
    serializer_class = ServicesSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class CreateTypeServiceView(APIView):
    def post(self, request, management_id):
        try:
            management = Management.objects.get(pk=management_id)
        except Management.DoesNotExist:
            return Response(
                {"error": "Management no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        data = request.data.copy()
        data['fk_management'] = management_id
        
        serializer = TypeServicesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)