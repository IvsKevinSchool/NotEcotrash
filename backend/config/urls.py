from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="NotEcotrash API",
        default_version='v1',
        description="API documentation for the NotEcotrash project",
        contact=openapi.Contact(email="contact@example.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('api/v1/accounts/auth/', include('apps.accounts.api.urls')),  # Rutas de la aplicación accounts
    path('api/v1/core/', include('apps.core.api.urls')),  # Rutas de la aplicación accounts
    path('api/v1/management/', include('apps.management.api.urls')),
    path('api/v1/waste/', include('apps.waste.api.urls')),
    path('api/v1/client/', include('apps.client.api.urls')),
    path('api/v1/services/', include('apps.services.api.urls')),  # Rutas de la aplicación services
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('admin/', admin.site.urls),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]

# Serve static and media files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)