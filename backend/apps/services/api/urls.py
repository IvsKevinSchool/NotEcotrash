from rest_framework.routers import DefaultRouter
from apps.services.api.views import StatusViewSet
from apps.services.api.views import TypeServicesViewSet

router = DefaultRouter()

router.register(r'status', StatusViewSet, basename='status')
router.register(r'typeservices', TypeServicesViewSet)

urlpatterns = router.urls