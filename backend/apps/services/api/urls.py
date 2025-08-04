from django.urls import path
from rest_framework.routers import DefaultRouter
<<<<<<< Updated upstream
from apps.services.api.views import StatusViewSet, TypeServicesViewSet, ServicesViewSet, ServiceLogViewSet, backup_database, destroy_and_restore_last_backup, export_table_to_csv, destroy_and_restore_base, restore_table_from_latest_csv, CreateTypeServiceView
=======
from apps.services.api.views import (
    StatusViewSet, TypeServicesViewSet, ServicesViewSet, ServiceLogViewSet,
    RecurringServiceViewSet, ServiceNotificationViewSet, generate_recurring_services,
    list_all_tables, backup_database, destroy_and_restore_last_backup, 
    export_table_to_csv, destroy_and_restore_base, restore_table_from_latest_csv, 
    CreateTypeServiceView
)
>>>>>>> Stashed changes

router = DefaultRouter()
router.register(r'status', StatusViewSet, basename='status')
router.register(r'typeServices', TypeServicesViewSet, basename='typeServices')
router.register(r'services', ServicesViewSet, basename='services')
router.register(r'service-logs', ServiceLogViewSet, basename='service-logs')
router.register(r'recurring-services', RecurringServiceViewSet, basename='recurring-services')
router.register(r'notifications', ServiceNotificationViewSet, basename='notifications')

urlpatterns = router.urls + [
    path(
        'management/<int:management_id>/type-services/',
        CreateTypeServiceView.as_view(),
        name='type-services-create'
    ),
    path('generate-recurring-services/', generate_recurring_services, name='generate-recurring-services'),
    path('backupCompleteDB/', backup_database, name='backup-database'),
    path('restoreCompleteDB/', destroy_and_restore_last_backup, name='restore-database'),
    path('restoreCompleteDBStruckture/', destroy_and_restore_base, name='restore-database'),
    path('restore_csv/', restore_table_from_latest_csv, name='restore-database'),
    path(
        'management/<int:management_id>/type-services/',
        CreateTypeServiceView.as_view(),
        name='type-services-create'
    ),
<<<<<<< Updated upstream
=======
    path('list-tables/', list_all_tables, name='list_tables'),
>>>>>>> Stashed changes
    path('export-csv/', export_table_to_csv, name='export-clientsusers'),  # 👈 Aquí
]
