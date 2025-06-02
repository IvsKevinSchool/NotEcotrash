from rest_framework import serializers
from apps.accounts.models import User

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, max_length=68, min_length=8)
    password2 = serializers.CharField(write_only=True, max_length=68, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'username','first_name', 'last_name', 'password', 'password2']

    def validate(self, attrs):
        """
        Validate the user registration data.
        Ensure that passwords match and email is unique.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email is already in use."})

        return attrs
        
    def create(self, validated_data):
        """
        Create a new user instance.
        This method hashes the password before saving the user.
        """
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class VerifyEmailSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6, required=True)