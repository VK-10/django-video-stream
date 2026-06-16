from rest_framework import request
from accounts.serializers import UserSerializer
from django.contrib.auth.hashers import make_password
from accounts.serializers import TokenSerializer
import hashlib
import uuid
from rest_framework import status
from rest_framework.response import Response
from datetime import datetime, timedelta
from rest_framework.views import APIView
from django.shortcuts import redirect
from django.contrib.auth import login
from django.views.generic import CreateView
from django.views.generic.edit import UpdateView 
from django.urls import reverse_lazy
from dotenv import load_dotenv
import os
from .models import User, Token
from django.utils import timezone

from django.core.mail import send_mail
from django.conf import settings

from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import AllowAny
from rest_framework.authentication import BasicAuthentication

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
# Create your views here.


class ResetPasswordView(APIView):
    def post(self, request, format=None):
        user_id = request.data["id"]
        token = request.data["token"]
        password = request.data["password"]

        # token_obj = Token.objects.filter(
        #     user_id=user_id).order_by("-created_at")[0]

        token_obj = Token.objects.filter(user_id=user_id).order_by("-created_at").first()
        if token_obj is None:
            return Response({"success": False, "message": "Invalid token"})

        if token_obj.expires_at < timezone.now():
            return Response({
                "success": False,
                "message": "password Reset Link has expired",
            }, status=status.HTTP_401_UNAUTHORIZED,)
        elif token_obj is None or token != token_obj.token or token_obj.is_used:
            return Response(
                {
                    "success": False,
                    "message": "Reset Password link is invalid!",
                },
                status= status.HTTP_401_UNAUTHORIZED
            )
        else:
            token_obj.is_used = True
            hashed_password = make_password(password=password, salt = SALT)
            ret_code = User.objects.filter(id=user_id).update(password=hashed_password)

            if ret_code:
                token_obj.save()
                return Response({
                    "success": True,
                    "message": "Your password reset was successfully!",
                },
                status=status.HTTP_200_OK,
                )

class ForgotpasswordView(APIView):
    def post(self, request, format=None):
        email = request.data["email"]
        user = User.objects.get(email= email)
        created_at = timezone.now()
        expires_at = timezone.now() + timedelta(days = 1)
        salt = uuid.uuid4().hex
        token = hashlib.sha512(
            (str(user.id) + user.password + created_at.isoformat() + salt).encode(
                "utf-8"
                )
            ).hexdigest()

        token_obj = {
                "token": token,
                "created_at": created_at,
                "expires_at": expires_at,
                "user_id": user.id,
            }

        serializer = TokenSerializer(data=token_obj)
        if serializer.is_valid():
            serializer.save()
            subject = "Forgot Password Link"
            content = mail_template(
                 "We have received a request to reset your password. Please reset your password using the link below.",
                f"{URL}/resetPassword?id={user.id}&token={token}",
                "Reset Password",
            )

            send_mail(
                subject=subject,
                message=content,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                html_message=content,
            )

            return Response(
                {
                    "success": True,
                    "message": "A password reset link has been sent to your mail."
                },
                status=status.HTTP_200_OK,
            )

        else:
            error_msg = ""
            for key in serializer.errors:
                error_msg += serializer.errors[key][0]
            return Response(
                {
                    "success": False,
                    "message": error_msg,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

class RegistrationView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "you are now registered on our website!"
                },
                status=status.HTTP_200_OK,
            )
        else:
            error_msg = ""
            for key in serializer.errors:
                error_msg += serializer.errors[key][0]

            print(serializer.errors)
            return Response(
    {
        "success": False,
        "errors": serializer.errors
    },
    status=status.HTTP_400_BAD_REQUEST,
)

class LoginView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        email = request.data["email"]
        password = request.data["password"]
        user = User.objects.filter(email=email).first()

        if user is None or not user.check_password(password):
            return Response(
                {
                    "success": False,
                    "message": "Invalid Login Credentials!",
                },
                status = status.HTTP_401_UNAUTHORIZED,
            )
        else:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            return Response(
                {"success": True, "message": "You are now logged in!", 
                "access_token": access_token, "refresh_token": refresh_token},
                status=status.HTTP_200_OK,
            )

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"success": True, "message": "You are now logged out!"},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"success": False, "message": "Invalid token!"},
                status=status.HTTP_400_BAD_REQUEST,
            )
