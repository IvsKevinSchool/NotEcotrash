from rest_framework.routers import DefaultRouter
from apps.core.api.views import LocationViewSet

# Create a router and register the LocationViewSet with it
router = DefaultRouter()
router.register(r'locations', LocationViewSet, basename='location')

# Define the URL patterns for the core app
urlpatterns = router.urls

