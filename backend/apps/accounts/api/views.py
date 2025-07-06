from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone


from apps.accounts.models import User, OneTimePassword
from apps.accounts.api.serializers import UserRegisterSerializer, VerifyEmailSerializer, LoginSerializer, ResetPasswordSerializer, SetNewPasswordSerializer
from apps.accounts.api.serializers import LogoutUserSerializer
from apps.accounts.utils import send_otp_email

from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator


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

class LoginUserView(GenericAPIView):
    serializer_class = LoginSerializer

    """
    This view is responsible for handling user login.
    It can be used to authenticate users and return a token or session.
    Currently, it does not implement any specific functionality.
    """
    def post(self, request, *args, **kwargs):
        """
        Handle user login.
        This method processes the incoming request to authenticate a user.
        It validates the credentials using the serializer and returns a success response if valid.
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        # Validate the serializer data
        # If the data is valid, authenticate the user
        if serializer.is_valid(raise_exception=True):
            # The validate method in the serializer will handle authentication
            return Response(
            {
                "message": "Login successful", 
                "data": serializer.validated_data
            },
            status=status.HTTP_200_OK
        )
        
        # If serializer is not valid, return the errors
        # This will automatically raise a ValidationError if the data is invalid
        return Response(
            {"message": "Login failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )

class PasswordResetView(GenericAPIView):
    serializer_class = ResetPasswordSerializer
    """
    This view is responsible for handling password reset requests.
    It can be used to initiate a password reset process for users.
    Currently, it does not implement any specific functionality.
    """
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
    
        return Response(
            {"message": "Password reset request received. Further instructions will be sent to your email."},
            status=status.HTTP_200_OK
        )

class PasswordResetConfirmView(GenericAPIView):
    def get(self, request, uidb64, token, *args, **kwargs):
        try:
            # Decode the user ID from the URL
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(id=uid)
            # Check if the token is valid
            if PasswordResetTokenGenerator().check_token(user, token):
                # If the token is valid, return a success response
                return Response({"message": "Token is valid. You can reset your password.", 
                                 "uidb64": uidb64, "token": token}, status=status.HTTP_200_OK)
            else:
                # If the token is invalid, return an error response
                return Response({"message": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        except DjangoUnicodeDecodeError:
            # Handle the case where the user ID cannot be decoded
            return Response({"message": "Invalid user ID."}, status=status.HTTP_400_BAD_REQUEST)
        
class SetNewPasswordView(GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    """
    This view is responsible for setting a new password for a user.
    It can be used to update the user's password after verification.
    Currently, it does not implement any specific functionality.
    """
    def patch(self, request, *args, **kwargs):
        """
        Handle setting a new password.
        This method processes the incoming request to update the user's password.
        It validates the data using the serializer and updates the password if valid.
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        return Response(
            {"message": "Password updated successfully"},
            status=status.HTTP_200_OK
        )

class LogoutUserView(GenericAPIView):
    serializer_class = LogoutUserSerializer
    permission_classes = [IsAuthenticated]
    """
    This view is responsible for handling user logout.
    It can be used to invalidate the user's session or token.
    Currently, it does not implement any specific functionality.
    """
    def post(self, request, *args, **kwargs):
        """
        Handle user logout.
        This method processes the incoming request to log out the user.
        It invalidates the user's session or token and returns a success response.
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        # Call the save method to perform the logout logic
        serializer.save()

        return Response(
            {"message": "Logout successful"},
            status=status.HTTP_204_NO_CONTENT
        )

# class TestAuthenticatedView(GenericAPIView):
#     serializer_class = None
#     """
#     A test view to check if the user is authenticated.
#     This view requires the user to be authenticated to access it.
#     """
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         """
#         Handle GET requests to this view.
#         Returns a success message if the user is authenticated.
#         """
#         return Response({"message": "You are authenticated!"}, status=status.HTTP_200_OK)