from accounts.views import LogoutView
from accounts.views import ResetPasswordView
from accounts.views import ForgotpasswordView
from accounts.views import LoginView
from accounts.views import RegistrationView
from django.shortcuts import redirect
from django.conf.urls.i18n import urlpatterns
from django.urls import path
from django.contrib.auth import views as auth_views
from django.views.decorators.csrf import csrf_exempt

app_name ="accounts"


urlpatterns = [
    path("register/", RegistrationView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("forgotPassword/", ForgotpasswordView.as_view(), name="forgotPassword"),
    path("resetPassword/", ResetPasswordView.as_view(), name="resetPassword"),
    path("logout/", csrf_exempt(LogoutView.as_view()), name="logout"),
]