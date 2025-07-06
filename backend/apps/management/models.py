from django.db import models
from apps.accounts.models import User
from apps.waste.models import Waste
from apps.core.models import Location

# Create your models here.
class Management(models.Model):
    """
    Model representing a management entity.
    This model can be extended in the future to include additional fields or methods.
    """
    pk_management = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    phone_number_2 = models.CharField(max_length=15, blank=True, null=True)
    rfc = models.CharField(max_length=13, unique=True, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Management ID: {self.pk_management}"

class ManagementUser(models.Model):
    """
    Model representing a user in the management system.
    This model can be extended in the future to include additional fields or methods.
    """
    pk_management_user = models.AutoField(primary_key=True)
    fk_management = models.ForeignKey(Management, on_delete=models.CASCADE, related_name='users')
    fk_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='management_users')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.username

class ManagementLocations(models.Model):
    pk_management_locations = models.AutoField(primary_key=True)
    fk_manageement = models.ForeignKey(Management, on_delete=models.CASCADE, related_name='management_locations')
    fk_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='locations')
    
    is_main = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.location
    
class ManagementWaste(models.Model):
    """
    Model representing a waste management entity.
    This model can be extended in the future to include additional fields or methods.
    """
    pk_management_waste = models.AutoField(primary_key=True)
    fk_management = models.ForeignKey(Management, on_delete=models.CASCADE, related_name='waste_managements')
    fk_waste = models.ForeignKey(Waste, on_delete=models.CASCADE, related_name='waste_managements')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Management Waste ID: {self.pk_management_waste} - Waste: {self.fk_waste.name}"