from django.contrib import admin
from django.urls import (
    include,
    path,
    re_path,
)
from rest_framework import routers

from .views import (
    email_preview,
    DashboardPageView,
    FeastsPageView,
    FeastPageView,
    CocktailsPageView,
    CocktailPageView,
    IngredientPageView,
    SearchView,
    FavoriteView,
    PriceChartDataView,
)

page_urls = [
    path('dashboard/', DashboardPageView.as_view()),
    path('feasts/', FeastsPageView.as_view()),
    path('feasts/<slug:slug>/', FeastPageView.as_view()),
    path('cocktails/', CocktailsPageView.as_view()),
    path('cocktails/<slug:slug>/', CocktailPageView.as_view()),
    path('ingredients/<slug:slug>/', IngredientPageView.as_view()),
]

urlpatterns = [
    # path('v1/', include(router.urls)),
    path('v1/pages/', include(page_urls)),
    path('v1/search', SearchView.as_view()),
    path('v1/favorite', FavoriteView.as_view()),
    path('v1/price-chart-data/<int:pk>/', PriceChartDataView.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path('email-preview/(?P<format>(html|txt))?/?$', email_preview, name='email_preview'),
]
