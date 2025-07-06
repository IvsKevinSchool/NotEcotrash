from django.db import models

# Create your models here.
class Location(models.Model):
    """
    Model representing a location.
    This model can be extended in the future to include additional fields or methods.
    """
    pk_location = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    postcode = models.CharField(max_length=20, unique=True, blank=True, null=True)
    interior_number = models.IntegerField(unique=True, blank=True, null=True)
    exterior_number = models.IntegerField(unique=True, blank=True, null=True)
    street_name = models.CharField(max_length=255, blank=True, null=True)
    neighborhood = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name