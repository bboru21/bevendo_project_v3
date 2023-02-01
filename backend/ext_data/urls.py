from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from .views import (
    calapi_inadiutorium_api_tool,
    calapi_inadiutorium_api_request,
)

urlpatterns = [
    path('calapi-inadiutorium-api-tool/', calapi_inadiutorium_api_tool, name='calapi_inadiutorium_api_tool'),
    path('calapi-inadiutorium-api-request/', calapi_inadiutorium_api_request, name='calapi_inadiutorium_api_request'),
]
