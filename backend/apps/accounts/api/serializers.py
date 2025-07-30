from rest_framework import status
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed

from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import DjangoUnicodeDecodeError
from django.utils.encoding import smart_str, smart_bytes, force_str
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from apps.accounts.models import User
from apps.accounts.utils import send_normal_email
from apps.management.models import Management
from apps.management.models import ManagementUser


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, max_length=68, min_length=8)
    password2 = serializers.CharField(write_only=True, max_length=68, min_length=8)

    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "first_name",
            "last_name",
            "role",
            "password",
            "password2",
        ]

    def validate(self, attrs):
        """
        Validate the user registration data.
        Ensure that passwords match and email is unique.
        """
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError({"email": "Email is already in use."})

        return attrs

    def create(self, validated_data):
        """
        Create a new user instance.
        This method hashes the password before saving the user.
        """
        user = User(
            email=validated_data["email"],
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            role=validated_data.get("role", "management"),
        )
        user.set_password(validated_data["password"])
        user.save()

        # Si el usuario es de tipo management, crear automáticamente el registro en Management
        if user.role == 'management':
            # Crear el Management primero
            management = Management.objects.create(
                name=f"{user.first_name} {user.last_name}".strip() or user.username,
                email=user.email,
                phone_number=None,
                phone_number_2=None,
                rfc=None,
            )
            
            # Crear la relación ManagementUser
            ManagementUser.objects.create(
                fk_management=management,
                fk_user=user
            )
        return user


class VerifyEmailSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6, required=True)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True, required=True, max_length=68, min_length=8
    )
    access_token = serializers.CharField(read_only=True)
    refresh_token = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "access_token", "refresh_token"]
        read_only_fields = ["access_token", "refresh_token"]

    def validate(self, attrs):
        """
        Validate the login credentials.
        Check if the user exists and the password is correct.
        """
        email = attrs.get("email")
        password = attrs.get("password")
        request = self.context.get("request")
        user = authenticate(request=request, email=email, password=password)

        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid credentials, try again.")

        user = authenticate(request=request, username=username, password=password)
        if not user:
            raise AuthenticationFailed("Invalid credentials, try again.")

        tokens = user.tokens()

        if not tokens:
            raise AuthenticationFailed("Token generation failed, try again.")

        return {
            "access_token": tokens["access"],
            "refresh_token": tokens["refresh"],
            "user": {
                "pk": user.pk,
                "email": user.email,
                "username": user.username,
                "full_name": user.get_full_name,
                "role": user.role,
            },
        }


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    class Meta:
        fields = ["email"]

    def validate_email(self, value):
        """
        Validate the email address.
        Check if the user exists and send a reset password email.
        """
        if User.objects.filter(email=value).exists():
            user = User.objects.get(email=value)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            request = self.context.get("request")
            site_domain = get_current_site(request).domain  # Get the current site domain of the frontend
            relative_link = reverse("password_reset_confirm", kwargs={"uidb64": uidb64, "token": token})
            absolute_url = f"http://{site_domain}{relative_link}"
            email_body = (
                f"Hello {user.username},\n\n"
                f"Use the link below to reset your password:\n{absolute_url}\n\n"
                "Thank you!"
            )
            data = {
                "subject": "Reset your password",
                "message": email_body,
                "recipient_list": [user.email],
            }
            send_normal_email(data)  # Envia el correo usando la función definida en utils.py
            return value
        else:
            raise serializers.ValidationError("User with this email does not exist.")

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, max_length=68, min_length=8)
    password2 = serializers.CharField(write_only=True, max_length=68, min_length=8)
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    class Meta:
        fields = ["password", "password2", "uidb64", "token"]

    def validate(self, attrs):
        try:
            token = attrs.get("token")
            uidb64 = attrs.get("uidb64")
            password = attrs.get("password")
            password2 = attrs.get("password2")

            try:
                user_id = force_str(urlsafe_base64_decode(uidb64))
            except (DjangoUnicodeDecodeError, ValueError):
                raise serializers.ValidationError("Invalid token or user ID.")

            user = User.objects.filter(id=user_id).first()

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError("Invalid token or user ID.", 401)
            if password != password2:
                raise serializers.ValidationError("Passwords do not match.")
            
            user.set_password(password)
            user.save()
            return user
        except Exception as e:
            raise serializers.ValidationError("Invalid token or user ID.", 401)

class LogoutUserSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(required=True, write_only=True)

    default_error_messages = {
        "token_not_found": "Token not found or already blacklisted.",
        "token_blacklisted": "Token is already blacklisted.",
    }

    def validate(self, attrs):
        """
        Validate the logout request.
        Ensure that the refresh token is provided.
        """
        refresh_token = attrs.get("refresh_token")
        if not refresh_token:
            raise serializers.ValidationError("Refresh token is required for logout.")
        
        # Here you can add logic to blacklist the refresh token if needed
        return attrs
    
    def save(self, **kwargs):
        """
        Save the logout request.
        This method can be used to blacklist the refresh token.
        """
        refresh_token = self.validated_data.get("refresh_token")
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            raise serializers.ValidationError(self.default_error_messages["token_not_found"])
        
        return {"message": "Logout successful."}