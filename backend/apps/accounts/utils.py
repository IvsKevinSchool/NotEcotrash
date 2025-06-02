import random
from django.core.mail import EmailMessage
from .models import User, OneTimePassword
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


def generate_otp():
    """Generates a random 6-digit OTP."""
    return str(random.randint(100000, 999999))


def send_otp_email(email):
    """Sends an OTP to the specified email address."""
    user = User.objects.filter(email=email).first()
    otp_code = generate_otp()
    
    subject = "Your OTP Code"
    message = f"Your OTP code is: {otp_code}"
    from_email = settings.DEFAULT_FROM_EMAIL

    OneTimePassword.objects.create(
        user=user,
        otp=otp_code,
        expires_at=timezone.now() + timezone.timedelta(minutes=5),
    )
    try:
        email_message = EmailMessage(subject, message, from_email, [email])
        email_message.send(fail_silently=False)
    except Exception as e:
        logger.error(f"Error sending OTP email: {e}")

