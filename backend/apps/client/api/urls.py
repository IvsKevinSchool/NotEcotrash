from rest_framework.routers import DefaultRouter
from apps.client.api.views import ClientViewSet, ClientsLocationsViewSet, ClientsUsersViewSet


# Create a router and register the LocationViewSet with it
router = DefaultRouter()
router.register(r'client', ClientViewSet, basename='management')
router.register(r'locations', ClientsLocationsViewSet, basename='locations')
router.register(r'user', ClientsUsersViewSet, basename='user')


# Define the URL patterns for the core app
urlpatterns = router.urls