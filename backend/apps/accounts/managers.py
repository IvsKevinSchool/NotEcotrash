from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def email_validator(self, email):
        """
        Validates the email format.
        Raises ValidationError if the email is invalid.
        """
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError(_("Invalid email address."))
        
    def create_user(self, email, username, first_name, last_name, password=None, **extra_fields):
        """
        Creates and returns a user with an email, username, first_name, last_name and password.
        """
        if not email:
            raise ValueError(_("The Email field must be set."))
        if not username:
            raise ValueError(_("The Username field must be set."))
        if not first_name:
            raise ValueError(_("The First Name field must be set."))
        if not last_name:
            raise ValueError(_("The Last Name field must be set."))

        self.email_validator(email)

        email = self.normalize_email(email)
        user = self.model(email=email, 
                          username=username, 
                          first_name=first_name, 
                          last_name=last_name, 
                          **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, first_name, last_name, password=None, **extra_fields):
        """
        Creates and returns a superuser with an email, username, first_name, last_name and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self.create_user(email, username, first_name, last_name, password, **extra_fields)