from django.db import models
from apps.management.models import Management
# Create your models here.
class Status(models.Model):
    pk_status = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name



class TypeServices(models.Model):
    pk_type_services = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    fk_management = models.ForeignKey(Management, on_delete=models.CASCADE, related_name='type_services')

    def __str__(self):
        return self.name
