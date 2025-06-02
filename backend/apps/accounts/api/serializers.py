from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from apps.accounts.models import User


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
        )
        user.set_password(validated_data["password"])
        user.save()
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
                "email": user.email,
                "username": user.username,
                "full_name": user.get_full_name,
            },
        }
