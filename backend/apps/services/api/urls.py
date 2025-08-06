from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.services.api.views import (
    StatusViewSet, TypeServicesViewSet, ServicesViewSet, ServiceLogViewSet,
    list_all_tables, backup_database, destroy_and_restore_last_backup, 
    export_table_to_csv, destroy_and_restore_base, restore_table_from_latest_csv, 
    CreateTypeServiceView, PendingServicesView, ApproveServiceView, RejectServiceView,
    TodayScheduledServicesView, AssignCollectorView, CollectorServicesView,
    CompleteServiceView, FilteredServicesView, AvailableCollectorsView,
    ClientServiceCreateView, ClientServicesView
)

router = DefaultRouter()
router.register(r'status', StatusViewSet, basename='status')
router.register(r'typeServices', TypeServicesViewSet, basename='typeServices')
router.register(r'services', ServicesViewSet, basename='services')
router.register(r'service-logs', ServiceLogViewSet, basename='service-logs')

urlpatterns = router.urls + [
    path(
        'management/<int:management_id>/type-services/',
        CreateTypeServiceView.as_view(),
        name='type-services-create'
    ),
    # Nuevas URLs para gestión de servicios
    path(
        'management/<int:management_id>/pending-services/',
        PendingServicesView.as_view(),
        name='pending-services'
    ),
    path(
        'services/<int:service_id>/approve/',
        ApproveServiceView.as_view(),
        name='approve-service'
    ),
    path(
        'services/<int:service_id>/reject/',
        RejectServiceView.as_view(),
        name='reject-service'
    ),
    path(
        'management/<int:management_id>/today-services/',
        TodayScheduledServicesView.as_view(),
        name='today-services'
    ),
    path(
        'services/<int:service_id>/assign-collector/',
        AssignCollectorView.as_view(),
        name='assign-collector'
    ),
    path(
        'collector/<int:collector_id>/services/',
        CollectorServicesView.as_view(),
        name='collector-services'
    ),
    path(
        'services/<int:service_id>/complete/',
        CompleteServiceView.as_view(),
        name='complete-service'
    ),
    path(
        'management/<int:management_id>/filtered-services/',
        FilteredServicesView.as_view(),
        name='filtered-services'
    ),
    path(
        'management/<int:management_id>/available-collectors/',
        AvailableCollectorsView.as_view(),
        name='available-collectors'
    ),
    path(
        'client/create-service/',
        ClientServiceCreateView.as_view(),
        name='client-create-service'
    ),
    path(
        'client/<int:client_id>/services/',
        ClientServicesView.as_view(),
        name='client-services'
    ),
    path('backupCompleteDB/', backup_database, name='backup-database'),
    path('restoreCompleteDB/', destroy_and_restore_last_backup, name='restore-database'),
    path('restoreBase/', destroy_and_restore_base, name='restore-base'),
    path('exportTable/', export_table_to_csv, name='export-table'),
    path('restoreFromCSV/', restore_table_from_latest_csv, name='restore-from-csv'),
    path('listTables/', list_all_tables, name='list-tables'),
]
