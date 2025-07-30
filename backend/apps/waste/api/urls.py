from rest_framework.routers import DefaultRouter
from apps.waste.api.views import WasteViewSet, WasteSubCategoryViewSet

# Create a router and register the LocationViewSet with it
router = DefaultRouter()
router.register(r'waste', WasteViewSet, basename='waste')
router.register(r'subcategory', WasteSubCategoryViewSet, basename='subcategory')

# Define the URL patterns for the core app
urlpatterns = router.urls