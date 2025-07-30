from rest_framework.routers import DefaultRouter
from apps.client.api.views import ClientViewSet, ClientsLocationsViewSet, ClientsUsersViewSet
from apps.client.api.view_by_manager import ClientsByManagerAPIView
from django.urls import path


# Create a router and register the LocationViewSet with it
router = DefaultRouter()
router.register(r'client', ClientViewSet, basename='management')
router.register(r'locations', ClientsLocationsViewSet, basename='locations')
router.register(r'user', ClientsUsersViewSet, basename='user')


# Define the URL patterns for the core app
urlpatterns = [
    path('client/by-management/<int:management_id>/', ClientsByManagerAPIView.as_view(), name='clients-by-manager'),
]

urlpatterns += router.urls
