from rest_framework import viewsets
from apps.waste.api.serializer import WasteSerializer, WasteSubCategorySerializer, WasteSubCategoryCreateUpdateSerializer, WasteUpdateSerializer
from apps.waste.models import Waste, WasteSubCategory
# Create Waste for Mnagement
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.management.models import Management, ManagementWaste
from apps.management.api.serializer import ManagementSerializer, ManagementWasteSerializer
# Update Waste for Management
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.exceptions import PermissionDenied

class WasteViewSet(viewsets.ModelViewSet):
    queryset = Waste.objects.all()
    serializer_class = WasteSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class WasteSubCategoryViewSet(viewsets.ModelViewSet):
    queryset = WasteSubCategory.objects.select_related('fk_waste').all()
    
    def get_serializer_class(self):
        """Usar diferentes serializers para diferentes acciones"""
        if self.action in ['create', 'update', 'partial_update']:
            return WasteSubCategoryCreateUpdateSerializer
        return WasteSubCategorySerializer

class CreateWasteForManagementAPIView(APIView):
    def post(self, request, management_id):
        # Paso 1: Crear el Waste
        waste_serializer = WasteSerializer(data=request.data)
        if waste_serializer.is_valid():
            waste = waste_serializer.save()  # Guarda el Waste
            
            # Paso 2: Crear la relación ManagementWaste
            management_waste_data = {
                'fk_management': management_id,
                'fk_waste': waste.pk_waste
            }
            management_waste_serializer = ManagementWasteSerializer(data=management_waste_data)
            
            if management_waste_serializer.is_valid():
                management_waste_serializer.save()
                return Response({
                    'waste': waste_serializer.data,
                    'management_waste': management_waste_serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                waste.delete()  # Si falla la relación, elimina el Waste creado
                return Response(management_waste_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(waste_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateWasteForManagementAPIView(RetrieveUpdateAPIView):
    queryset = Waste.objects.all()
    serializer_class = WasteUpdateSerializer

    def perform_update(self, serializer):
        waste = self.get_object()
        management_id = self.kwargs['management_id']
        
        # Verifica que el Waste esté relacionado con el Management
        if not ManagementWaste.objects.filter(fk_management=management_id, fk_waste=waste).exists():
            raise PermissionDenied("Este Waste no pertenece al Management especificado.")
        
        serializer.save()  # Actualiza el Waste

class WasteByManagementAPIView(APIView):
    def get(self, request, management_id):
        # Obtiene los Waste relacionados con el Management
        waste_ids = ManagementWaste.objects.filter(
            fk_management=management_id
        ).values_list('fk_waste', flat=True)  # Lista de IDs de Waste
        
        wastes = Waste.objects.filter(pk_waste__in=waste_ids)
        serializer = WasteSerializer(wastes, many=True)
        return Response(serializer.data)

class WasteSubCategoryByManagementAPIView(APIView):
    def get(self, request, management_id):
        # Obtiene las subcategorías de residuos relacionadas con el Management a través de Waste
        waste_ids = ManagementWaste.objects.filter(
            fk_management=management_id
        ).values_list('fk_waste', flat=True)
        
        subcategories = WasteSubCategory.objects.select_related('fk_waste').filter(
            fk_waste__in=waste_ids
        )
        serializer = WasteSubCategorySerializer(subcategories, many=True)
        return Response(serializer.data)

class CreateWasteSubCategoryForManagementAPIView(APIView):
    def post(self, request, management_id):
        # Verifica que el Waste especificado pertenezca al Management
        waste_id = request.data.get('fk_waste')
        if not waste_id:
            return Response({'error': 'fk_waste es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verifica que el Waste esté relacionado con el Management
        if not ManagementWaste.objects.filter(fk_management=management_id, fk_waste=waste_id).exists():
            return Response({
                'error': 'El Waste especificado no pertenece a este Management'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Crea la subcategoría
        serializer = WasteSubCategoryCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            subcategory = serializer.save()
            return Response(WasteSubCategorySerializer(subcategory).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateWasteSubCategoryForManagementAPIView(RetrieveUpdateAPIView):
    queryset = WasteSubCategory.objects.select_related('fk_waste').all()
    serializer_class = WasteSubCategoryCreateUpdateSerializer

    def perform_update(self, serializer):
        subcategory = self.get_object()
        management_id = self.kwargs['management_id']
        
        # Verifica que la subcategoría pertenezca a un Waste del Management
        if not ManagementWaste.objects.filter(
            fk_management=management_id, 
            fk_waste=subcategory.fk_waste
        ).exists():
            raise PermissionDenied("Esta subcategoría no pertenece al Management especificado.")
        
        serializer.save()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        management_id = self.kwargs['management_id']
        
        # Verifica que la subcategoría pertenezca a un Waste del Management
        if not ManagementWaste.objects.filter(
            fk_management=management_id, 
            fk_waste=instance.fk_waste
        ).exists():
            raise PermissionDenied("Esta subcategoría no pertenece al Management especificado.")
        
        serializer = WasteSubCategorySerializer(instance)
        return Response(serializer.data)

class DeleteWasteForManagementAPIView(APIView):
    def delete(self, request, management_id, pk):
        try:
            waste = Waste.objects.get(pk_waste=pk)
        except Waste.DoesNotExist:
            return Response({'error': 'Waste no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Verifica que el Waste esté relacionado con el Management
        if not ManagementWaste.objects.filter(fk_management=management_id, fk_waste=waste).exists():
            raise PermissionDenied("Este Waste no pertenece al Management especificado.")
        
        # Elimina la relación ManagementWaste primero
        ManagementWaste.objects.filter(fk_management=management_id, fk_waste=waste).delete()
        
        # Elimina el Waste (esto también eliminará las subcategorías relacionadas por CASCADE)
        waste.delete()
        
        return Response({'message': 'Waste eliminado exitosamente'}, status=status.HTTP_204_NO_CONTENT)

class DeleteWasteSubCategoryForManagementAPIView(APIView):
    def delete(self, request, management_id, pk):
        try:
            subcategory = WasteSubCategory.objects.select_related('fk_waste').get(pk_waste_subcategory=pk)
        except WasteSubCategory.DoesNotExist:
            return Response({'error': 'Subcategoría no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        # Verifica que la subcategoría pertenezca a un Waste del Management
        if not ManagementWaste.objects.filter(
            fk_management=management_id, 
            fk_waste=subcategory.fk_waste
        ).exists():
            raise PermissionDenied("Esta subcategoría no pertenece al Management especificado.")
        
        # Elimina la subcategoría
        subcategory.delete()
        
        return Response({'message': 'Subcategoría eliminada exitosamente'}, status=status.HTTP_204_NO_CONTENT)

class DeleteWasteSubCategoryForManagementAPIView(APIView):
    def delete(self, request, management_id, pk):
        try:
            subcategory = WasteSubCategory.objects.select_related('fk_waste').get(pk_waste_subcategory=pk)
        except WasteSubCategory.DoesNotExist:
            return Response({'error': 'Subcategoría no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        # Verifica que la subcategoría pertenezca a un Waste del Management
        if not ManagementWaste.objects.filter(
            fk_management=management_id, 
            fk_waste=subcategory.fk_waste
        ).exists():
            raise PermissionDenied("Esta subcategoría no pertenece al Management especificado.")
        
        # Elimina la subcategoría
        subcategory.delete()
        
        return Response({'message': 'Subcategoría eliminada exitosamente'}, status=status.HTTP_204_NO_CONTENT)