from rest_framework.routers import DefaultRouter
from apps.services.api.views import StatusViewSet, TypeServicesViewSet, ServicesViewSet

router = DefaultRouter()

router.register(r'status', StatusViewSet, basename='status')
router.register(r'typeServices', TypeServicesViewSet, basename='typeServices')
router.register(r'services', ServicesViewSet, basename='services')

urlpatterns = router.urls