from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

from apps.accounts.models import User
from .serializers import UserRegisterSerializer
from apps.accounts.utils import send_otp_email


class RegisterUserView(GenericAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request, *args, **kwargs):
        """
        Handle user registration.
        This method processes the incoming request to create a new user.
        It validates the data using the serializer and saves the user if valid.
        """
        serializer = self.get_serializer(data=request.data)

        # Validate the serializer data
        # If the data is valid, save the user
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()

            # Optionally, send an OTP email after user creation
            send_otp_email(user.email)

            # Return a success response with the created user data
            # The user instance is returned by the serializer's save method
            return Response(
                {"data": serializer.data, "message": "User created successfully"},
                status=HTTP_201_CREATED,
            )
        # If serializer is not valid, return the errors
        # This will automatically raise a ValidationError if the data is invalid
        return Response(
            {"message": "User creation failed", "errors": serializer.errors}, status=HTTP_400_BAD_REQUEST
        )
