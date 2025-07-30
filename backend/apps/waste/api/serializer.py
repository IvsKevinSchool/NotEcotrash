from rest_framework import serializers
from apps.waste.models import Waste, WasteSubCategory

class WasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waste
        fields = '__all__'
        #read_only_fields = ['pk_waste', 'created_at', 'update_at', 'is_active']

class WasteSubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteSubCategory
        fields = '__all__'
        #read_only_fields = ['pk_waste_subcategory', 'fk_waste', 'is_active']

# serializers.py
class WasteUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waste
        fields = ['name', 'description', 'is_active']  # Campos editables
        # Excluye 'pk_waste', 'created_at', 'updated_at' (no editables)