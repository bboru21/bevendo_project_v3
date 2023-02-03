from django.contrib import admin
from django.urls import (
    include,
    path,
    re_path,
)
from rest_framework import routers

from .views import (
    email_preview,
    CocktailViewSet,
    FeastViewSet,
    IndexPageView,
)

router = routers.DefaultRouter()
router.register('feasts', FeastViewSet)
router.register('cocktails', CocktailViewSet)

page_urls = [
    path('index/', IndexPageView.as_view()),
]

urlpatterns = [
    path('v1/', include(router.urls)),
    path('v1/pages/', include(page_urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path('email-preview/(?P<format>(html|txt))?/?$', email_preview, name='email_preview'),
]
