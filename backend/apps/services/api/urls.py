from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.services.api.views import StatusViewSet, TypeServicesViewSet, ServicesViewSet, backup_database, destroy_and_restore_last_backup, export_table_to_csv, CreateTypeServiceView
router = DefaultRouter()
router.register(r'status', StatusViewSet, basename='status')
router.register(r'typeServices', TypeServicesViewSet, basename='typeServices')
router.register(r'services', ServicesViewSet, basename='services')
router.register(r'service-logs', ServiceLogViewSet, basename='service-logs')

urlpatterns = router.urls + [
    path('backupCompleteDB/', backup_database, name='backup-database'),
    path('restoreCompleteDB/', destroy_and_restore_last_backup, name='restore-database'),
    path(
        'management/<int:management_id>/type-services/',
        CreateTypeServiceView.as_view(),
        name='type-services-create'
    ),
    path('export-csv/', export_table_to_csv, name='export-clientsusers'),  # 👈 Aquí
]
