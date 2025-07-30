from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.services.api.views import StatusViewSet, TypeServicesViewSet, ServicesViewSet, backup_database, CreateTypeServiceView

router = DefaultRouter()
router.register(r'status', StatusViewSet, basename='status')
router.register(r'typeServices', TypeServicesViewSet, basename='typeServices')
router.register(r'services', ServicesViewSet, basename='services')

urlpatterns = router.urls + [
    path('backup/', backup_database, name='backup-database'),
        path(
        'management/<int:management_id>/type-services/',
        CreateTypeServiceView.as_view(),
        name='type-services-create'
    ),
]
