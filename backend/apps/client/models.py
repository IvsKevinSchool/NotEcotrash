from django.db import models
from apps.management.models import Management
from apps.core.models import Location
from apps.accounts.models import User

# Create your models here
class Client(models.Model):
    pk_client = models.AutoField(primary_key=True)
    fk_management = models.ForeignKey(Management, on_delete=models.CASCADE)
    
    name = models.CharField(max_length=255, unique=True)
    legal_name = models.CharField(max_length=255, unique=True)
    rfc = models.CharField(max_length=13, unique=True)
    email = models.CharField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    phone_number_2 = models.CharField(max_length=15, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True) 

class ClientsLocations(models.Model):
    pk_client_location = models.AutoField(primary_key=True)
    fk_client = models.ForeignKey(Client, on_delete=models.CASCADE)
    fk_location = models.ForeignKey(Location, on_delete=models.CASCADE)
    
    is_main = models.BooleanField(default=True)

class ClientsUsers(models.Model):
    pk_client_user = models.AutoField(primary_key=True)
    fk_client = models.ForeignKey(Client, on_delete=models.CASCADE)
    fk_user= models.ForeignKey(User, on_delete=models.CASCADE)