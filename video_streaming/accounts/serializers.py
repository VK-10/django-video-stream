
from rest_framework import serializers
from .models import User, Token


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    country = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    phone = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields= ["username", "email", "password1", "password2", "country", "phone"]

    def validate(self, data):
        print("VALIDATE FUNC:", data)
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data["name"] = validated_data.pop("username")
        validated_data.pop("password2")
        password = validated_data.pop("password1")

        return User.objects.create_user(password=password, **validated_data)

    
class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ["token", "created_at", "expires_at", "user_id", "is_used"]

