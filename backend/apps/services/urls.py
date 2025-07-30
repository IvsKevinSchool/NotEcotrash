from django.urls import path
from .views import backup_database

urlpatterns = [
    path('api/backup/', backup_database),
]
