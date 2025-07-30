from rest_framework.routers import DefaultRouter
from apps.client.api.views import ClientViewSet, ClientsLocationsViewSet, ClientsUsersViewSet, ClientLocationCreateAPIView, ClientLocationsList, AllClientLocationsForManagement
from apps.client.api.view_by_manager import ClientsByManagerAPIView
from django.urls import path


# Create a router and register the LocationViewSet with it
router = DefaultRouter()
router.register(r'client', ClientViewSet, basename='management')
router.register(r'locations', ClientsLocationsViewSet, basename='locations')
router.register(r'user', ClientsUsersViewSet, basename='user')


# Define the URL patterns for the core app
urlpatterns = [
    path('by-management/<int:management_id>/', ClientsByManagerAPIView.as_view(), name='clients-by-manager'),
    path('<int:client_id>/locations/', ClientLocationCreateAPIView.as_view(), name='client-locations-create'),
    path('<int:client_id>/locations/<int:location_id>/', ClientLocationCreateAPIView.as_view(), name='client-locations-update'),
    path('<int:client_id>/locations/list/', ClientLocationsList.as_view(), name='client-locations-list'),
    path('management/<int:management_id>/all-locations/', AllClientLocationsForManagement.as_view(), name='all-client-locations-for-management'),
]

# Add router URLs
urlpatterns += router.urls
