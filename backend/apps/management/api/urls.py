from rest_framework.routers import DefaultRouter
from apps.management.api.views import ManagementViewSet


# Create a router and register the LocationViewSet with it
router = DefaultRouter()
router.register(r'management', ManagementViewSet, basename='management')

# Define the URL patterns for the core app
urlpatterns = router.urls