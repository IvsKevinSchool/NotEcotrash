from rest_framework.routers import DefaultRouter
from apps.management.api.views import ManagementViewSet, ManagementLocationsViewSet, ManagementUserViewSet, ManagementWasteViewSet, CollectorUsersViewSet


# Create a router and register the LocationViewSet with it
router = DefaultRouter()
router.register(r'management', ManagementViewSet, basename='management')
router.register(r'locations', ManagementLocationsViewSet, basename='locations')
router.register(r'user', ManagementUserViewSet, basename='user')
router.register(r'waste', ManagementWasteViewSet, basename='waste')
router.register(r'certificate', ManagementWasteViewSet, basename='certificate')
router.register(r'collector', CollectorUsersViewSet, basename='collector')


# Define the URL patterns for the core app
urlpatterns = router.urls