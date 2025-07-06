from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterUserView, VerifyUserEmail, LoginUserView
from .views import PasswordResetView, PasswordResetConfirmView, SetNewPasswordView, LogoutUserView
# Rutas para vistas basadas en clases
urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='user-register'),
    path('verify-email/', VerifyUserEmail.as_view(), name='user-verify-email'),
    path('login/', LoginUserView.as_view(), name='user-login'),
    # path('test-authenticated/', TestAuthenticatedView.as_view(), name='test-authenticated'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('set-new-password/', SetNewPasswordView.as_view(), name='set-new-password'),
    path('logout/', LogoutUserView.as_view(), name='user-logout'),

]

# Rutas para ViewSets usando DefaultRouter
router = DefaultRouter()
# router.register(r'papers', PaperViewSet, basename='paper')

# Combinar ambas
urlpatterns += [
    path('', include(router.urls)),
]