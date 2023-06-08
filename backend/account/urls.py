from django.urls import path

from .views import (
    index,
    RegisterView,
    LoadUserView,
    ChangePasswordView,
    SendPasswordResetEmail,
)

urlpatterns = [
    path('', index),
    path('register', RegisterView.as_view()),
    path('user', LoadUserView.as_view()),
    path('change-password', ChangePasswordView.as_view()),
    path('send-password-reset-email', SendPasswordResetEmail.as_view()),
]
