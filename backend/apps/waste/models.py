from django.db import models

# Create your models here.
class Waste(models.Model):
    pk_waste = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=255, blank=True, null=True)
        
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True) 

class WasteSubCategory(models.Model):
    pk_waste_subcategory = models.AutoField(primary_key=True)
    fk_waste = models.ForeignKey(Waste, on_delete=models.CASCADE, related_name='waste')
    description = models.CharField(max_length=255, unique=True)

    is_active = models.BooleanField(default=True)
