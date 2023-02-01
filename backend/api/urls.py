from django.contrib import admin
from django.urls import (
    include,
    path,
    re_path,
)
from rest_framework import routers

from .views import (
    index,
    email_preview,
    CocktailViewSet,
    FeastViewSet,
)

router = routers.DefaultRouter()
router.register('feasts', FeastViewSet)
router.register('cocktails', CocktailViewSet)

urlpatterns = [
    path('', index, name='api_index'),
    path('v1/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path('email-preview/(?P<format>(html|txt))?/?$', email_preview, name='email_preview'),
]
