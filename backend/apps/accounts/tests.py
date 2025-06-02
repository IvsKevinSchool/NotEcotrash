from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from apps.accounts.models import User, OneTimePassword
import random

class UserRegistrationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Asumiendo que la URL de registro está configurada como 'user-register'
        self.register_url = reverse('user-register')
        self.user_data = {
            "email": "test@example.com",
            "username": "testuser",
            "first_name": "Test",
            "last_name": "User",
            "password": "testpassword123",
            "password2": "testpassword123",
        }

    def test_user_registration_success(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username=self.user_data["username"])
        self.assertEqual(user.email, self.user_data["email"])

    def test_user_registration_password_mismatch(self):
        data = self.user_data.copy()
        data["password2"] = "differentpassword"
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)


class OneTimePasswordModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="otp@example.com",
            username="otpuser",
            first_name="OTP",
            last_name="User",
            password="otppassword123"
        )
        # Genera un OTP y usa now() para expiración
        self.otp_value = str(random.randint(100000, 999999))
        self.otp_instance = OneTimePassword.objects.create(
            user=self.user,
            otp=self.otp_value,
            expires_at=timezone.now() + timezone.timedelta(minutes=5)
        )

    def test_otp_is_valid(self):
        self.assertTrue(self.otp_instance.is_valid())

    def test_otp_is_invalid_after_expiration(self):
        # Simulamos que ya pasó el tiempo de expiración
        self.otp_instance.expires_at = timezone.now() - timezone.timedelta(minutes=1)
        self.otp_instance.save()
        self.assertFalse(self.otp_instance.is_valid())