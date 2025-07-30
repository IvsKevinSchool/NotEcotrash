
from rest_framework.routers import DefaultRouter
from apps.core.api.views import LocationViewSet
from django.urls import path
from apps.core.api.backup_views import GeneralBackupView, ClientesBackupView

# Create a router and register the LocationViewSet with it
router = DefaultRouter()
router.register(r'locations', LocationViewSet, basename='location')

# Define the URL patterns for the core app
urlpatterns = router.urls + [
    path('backup/general/', GeneralBackupView.as_view(), name='backup-general'),
    path('backup/clientes/', ClientesBackupView.as_view(), name='backup-clientes'),
]

