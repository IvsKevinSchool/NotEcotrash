from django.contrib.auth.backends import ModelBackend
from apps.accounts.models import User

class EmailBackend(ModelBackend):
    """
    Autenticación usando email y password.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        email = kwargs.get('email', username)
        try:
            user = User.objects.get(email=email)
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        except User.DoesNotExist:
            return None
