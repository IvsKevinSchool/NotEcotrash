from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterUserView, VerifyUserEmail, LoginUserView

# Rutas para vistas basadas en clases
urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='user-register'),
    path('verify-email/', VerifyUserEmail.as_view(), name='user-verify-email'),
    path('login/', LoginUserView.as_view(), name='user-login'),
]

# Rutas para ViewSets usando DefaultRouter
router = DefaultRouter()
# router.register(r'papers', PaperViewSet, basename='paper')

# Combinar ambas
urlpatterns += [
    path('', include(router.urls)),
]