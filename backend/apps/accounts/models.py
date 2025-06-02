from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from .managers import UserManager
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

# Create your models here.
class User(AbstractUser, PermissionsMixin):
    """
    Custom user model that extends Django's AbstractUser and PermissionsMixin.
    This model can be used to add additional fields or methods in the future.
    """
    email = models.EmailField(_('email address'), unique=True)

    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    username = models.CharField(_('username'), max_length=150, unique=True)

    date_joined = models.DateTimeField(auto_now_add=True, verbose_name=_('date joined'))
    last_login = models.DateTimeField(auto_now=True, verbose_name=_('last login'))

    is_staff = models.BooleanField(_('staff status'), default=False)
    is_superuser = models.BooleanField(_('superuser status'), default=False)
    is_verified = models.BooleanField(_('verified'), default=False)
    is_active = models.BooleanField(_('active'), default=True) 

    USERNAME_FIELD = 'username'

    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    objects = UserManager()

    def __str__(self):
        return self.username
    
    @property
    def get_full_name(self):
        """
        Returns the full name of the user by combining first and last names.
        """
        return f"{self.first_name} {self.last_name}".strip()
    
    def tokens(self):
        """
        Placeholder for token generation logic.
        This method can be overridden to implement token generation for the user.
        """
        return None

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['username']

class OneTimePassword(models.Model):
    """
    Model to store One-Time Passwords (OTPs) for user verification.
    This model can be used to implement OTP-based authentication or verification.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_codes')
    otp = models.CharField(max_length=6, verbose_name=_('OTP code'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('created at'))
    expires_at = models.DateTimeField(default=timezone.now, verbose_name=_('expires at'))

    def __str__(self):
        return f"OTP for {self.user.username} - {self.otp}"
    
    def is_valid(self):
        """        
        Check if the OTP is still valid based on its expiration time.
        Returns:
            bool: True if the OTP is valid, False otherwise.
        """
        return timezone.now() < self.expires_at

    class Meta:
        verbose_name = _('One-Time Password')
        verbose_name_plural = _('One-Time Passwords')
        ordering = ['-created_at']