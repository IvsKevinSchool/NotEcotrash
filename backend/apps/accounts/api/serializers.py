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
from apps.client.models import Client
from apps.client.models import ClientsUsers


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, max_length=68, min_length=8)
    password2 = serializers.CharField(write_only=True, max_length=68, min_length=8)
    
    # Campos específicos para Management
    phone_number = serializers.CharField(required=False, allow_null=True)
    phone_number_2 = serializers.CharField(required=False, allow_null=True, allow_blank=True, default=None)
    rfc = serializers.CharField(required=False, allow_null=True)
    
    # Campos específicos para Client
    legal_name = serializers.CharField(required=False, allow_null=True)
    management_id = serializers.IntegerField(required=False, allow_null=True)

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
            "phone_number",
            "phone_number_2",
            "rfc",
            "legal_name",
            "management_id",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError({"email": "Email is already in use."})

        # Validación adicional para Client
        if attrs.get("role") == "client" and not attrs.get("management_id"):
            raise serializers.ValidationError({"management_id": "Management ID is required for clients."})

        return attrs

    def create(self, validated_data):
        # Extraer datos específicos de Management/Client
        phone_number = validated_data.pop('phone_number', None)
        phone_number_2 = validated_data.pop('phone_number_2', None)
        rfc = validated_data.pop('rfc', None)
        legal_name = validated_data.pop('legal_name', None)
        management_id = validated_data.pop('management_id', None)

        # Crear usuario
        user = User(
            email=validated_data["email"],
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            role=validated_data.get("role", "management"),
        )
        user.set_password(validated_data["password"])
        user.save()

        if user.role == 'management':
            management = Management.objects.create(
                name=f"{user.first_name} {user.last_name}".strip() or user.username,
                email=user.email,
                phone_number=phone_number or None,
                phone_number_2=phone_number_2 or None if phone_number_2 else None,
                rfc=rfc,
            )
            ManagementUser.objects.create(
                fk_management=management,
                fk_user=user
            )

        elif user.role == 'client':
            if not management_id:
                raise serializers.ValidationError({"management_id": "Management ID is required for client registration."})
            
            try:
                management = Management.objects.get(pk=management_id)
            except Management.DoesNotExist:
                raise serializers.ValidationError({"management_id": "Invalid Management ID."})
                
            client = Client.objects.create(
                fk_management=management,
                name=f"{user.first_name} {user.last_name}".strip() or user.username,
                legal_name=legal_name or f"{user.first_name} {user.last_name}".strip() or user.username,
                rfc=rfc,
                email=user.email,
                phone_number=phone_number,
                phone_number_2=phone_number_2,
            )
            ClientsUsers.objects.create(
                fk_client=client,
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

        # Obtener información del Management asociado al usuario
        management_info = {}
        try:
            management_user = ManagementUser.objects.get(fk_user=user)
            management = management_user.fk_management
            management_info = {
                "pk_management": management.pk_management,
                "name": management.name,
                "email": management.email,
                "phone_number": management.phone_number,
                "phone_number_2": management.phone_number_2,
                "rfc": management.rfc
            }
        except ManagementUser.DoesNotExist:
            # El usuario no está asociado a un Management
            pass
        
        # Obtener información del Cliente asociado al usuario
        client_info = {}
        try:
            client_user = ClientsUsers.objects.get(fk_user=user)
            client = client_user.fk_client
            client_info = {
                "pk_client": client.pk,
                "name": client.name,
                "legal_name": client.legal_name,
                "email": client.email,
                "phone_number": client.phone_number,
                "phone_number_2": client.phone_number_2,
                "rfc": client.rfc
            }
        except ClientsUsers.DoesNotExist:
            # El usuario no está asociado a un Cliente
            pass

        # Obtener información del Collector asociado al usuario
        collector_info = {}
        try:
            from apps.management.models import CollectorUsers
            collector_user = CollectorUsers.objects.get(fk_user=user)
            collector_info = {
                "pk_collector_user": collector_user.pk_collector_user,
                "name": collector_user.name,
                "last_name": collector_user.last_name,
                "phone_number": collector_user.phone_number,
                "fk_management": collector_user.fk_management.pk_management
            }
        except CollectorUsers.DoesNotExist:
            # El usuario no está asociado a un Collector
            pass

        return {
            "access_token": tokens["access"],
            "refresh_token": tokens["refresh"],
            "user": {
                "pk": user.pk,
                "email": user.email,
                "username": user.username,
                "full_name": user.get_full_name,
                "role": user.role,
                "is_first_login": user.is_first_login,  # Agregar campo is_first_login
            },
            "management": management_info,
            "client": client_info,
            "collector": collector_info
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


class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing users with basic information.
    """
    get_full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'get_full_name',
            'role',
            'email',
            'is_active'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing password for first-time login users.
    Only requires new password since current password is temporary and known.
    """
    new_password = serializers.CharField(required=True, min_length=8)
    
    def validate_new_password(self, value):
        """
        Validate the new password.
        """
        user = self.context['request'].user
        
        # Check if new password is not the temporary password
        if value in ['TempPass123!', 'TempPass123']:
            raise serializers.ValidationError("New password cannot be the same as the temporary password.")
        
        return value
    
    def save(self):
        """
        Save the new password and update first login status.
        """
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.is_first_login = False  # Mark as no longer first login
        user.save()
        return user