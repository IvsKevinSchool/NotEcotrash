from rest_framework.routers import DefaultRouter
from apps.management.api.views import ManagementViewSet, ManagementLocationsViewSet, ManagementUserViewSet, ManagementWasteViewSet, CollectorUsersViewSet, CreateCollectorByManagementAPIView, CollectorUserUpdateAPIView, CreateManagementLocationAPIView, ManagementLocationsList
from apps.waste.api.views import CreateWasteForManagementAPIView, UpdateWasteForManagementAPIView, WasteByManagementAPIView
from django.urls import path


# Create a router and register the LocationViewSet with it
router = DefaultRouter()
router.register(r'management', ManagementViewSet, basename='management')
router.register(r'locations', ManagementLocationsViewSet, basename='locations')
router.register(r'user', ManagementUserViewSet, basename='user')
router.register(r'waste', ManagementWasteViewSet, basename='waste')
router.register(r'collector', CollectorUsersViewSet, basename='collector')

# Create Waste for Management
urlpatterns = [
    path('management/<int:management_id>/create-waste/', 
    CreateWasteForManagementAPIView.as_view(), 
    name='create-waste-for-management'),
    path(
    'management/<int:management_id>/update-waste/<int:pk>/',
    UpdateWasteForManagementAPIView.as_view(),
    name='update-waste-for-management'
    ),
    path(
    'management/<int:management_id>/wastes/',
    WasteByManagementAPIView.as_view(),
    name='wastes-by-management'
    ),
    path(
    'management/<int:management_id>/create-collector/',
    CreateCollectorByManagementAPIView.as_view(),
    name='create-collector'
    ),
    path(
    'collectors/<int:pk>/',
    CollectorUserUpdateAPIView.as_view(),
    name='collector-update'
    ),
    path(
    'management/<int:management_id>/locations/',
    CreateManagementLocationAPIView.as_view(),
    name='create-management-location'
    ),
    path('management/list/<int:management_id>/locations/', 
    ManagementLocationsList.as_view(), 
    name='management-locations'
    ),
]

# Define the URL patterns for the core app
urlpatterns += router.urls