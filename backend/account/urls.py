from django.urls import path

from .views import (
    index,
    RegisterView, 
    LoadUserView,
)

urlpatterns = [
    path('', index),
    path('register', RegisterView.as_view()),
    path('user', LoadUserView.as_view()),
]
