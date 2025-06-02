from django.utils import timezone
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.models import User, OneTimePassword
from .serializers import UserRegisterSerializer, VerifyEmailSerializer
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
                status=status.HTTP_201_CREATED,
            )
        # If serializer is not valid, return the errors
        # This will automatically raise a ValidationError if the data is invalid
        return Response(
            {"message": "User creation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )

class VerifyUserEmail(GenericAPIView):
    serializer_class = VerifyEmailSerializer

    """
    This view is responsible for verifying a user.
    It can be used to handle user verification logic, such as confirming an email address.
    Currently, it does not implement any specific functionality.
    """
    def post(self, request, *args, **kwargs):
        otp = request.data.get("otp")
        if not otp:
            return Response({"message": "OTP is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Attempt to retrieve the OneTimePassword instance using the provided OTP
            # If the OTP is valid, it will return the corresponding user
            otp_instance = OneTimePassword.objects.get(otp=otp)

            # Verify if the OTP has expired
            # If the current time is greater than the expiration time, return an error
            if timezone.now() > otp_instance.expires_at:
                return Response({"message": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST)
            user = otp_instance.user            

            # Check if the user is already verified
            # If not, mark the user as verified
            if not user.is_verified:
                user.is_verified = True
                user.save()
                return Response({"message": "Account verified successfully"}, status=status.HTTP_200_OK)

            return Response({"message": "Account already verified"}, status=status.HTTP_204_NO_CONTENT)
        except OneTimePassword.DoesNotExist:
            return Response({"message": "Invalid OTP. Does not exist"}, status=status.HTTP_400_BAD_REQUEST)

