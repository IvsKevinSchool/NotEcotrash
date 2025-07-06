from rest_framework.routers import DefaultRouter
from apps.waste.api.views import WasteViewSet

# Create a router and register the LocationViewSet with it
router = DefaultRouter()
router.register(r'waste', WasteViewSet, basename='waste')

# Define the URL patterns for the core app
urlpatterns = router.urls