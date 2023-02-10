import datetime

from django.shortcuts import render
from django.http import HttpResponse
from django.utils.dateformat import DateFormat
from django.contrib.auth.models import User

from rest_framework import ( permissions, status, viewsets )
from rest_framework.views import APIView
from rest_framework.response import Response


from .serializers import (
    CocktailSerializer,
    FeastSerializer,
)
from account.serializers import UserSerializer

from .models import (
    Feast,
    Cocktail,
)

from .utils import (
    get_email_date_range,
    get_email_feasts_products,
    get_email_deals,
)

from ext_data.models import (
    get_latest_price_pull_date,
)

from api.constants import (
    PRICE_PER_SIZE_SCORE_PERCENT,
    PRICE_PER_LITER_SCORE_PERCENT,
    DEALS_MIN_PRICE_SCORE,
)


def email_preview(request, format='html'):

    start_date = request.GET.get('start_date')
    if start_date:
        try:
            start_date = datetime.datetime.strptime(start_date, '%m-%d-%Y').date()
        except ValueErorr:
            start_date = None

    (start_date, end_date) = get_email_date_range(start_date)
    latest_pull_date = get_latest_price_pull_date()

    (feasts, products) = get_email_feasts_products(start_date, end_date, latest_pull_date)
    deals = get_email_deals(latest_pull_date)

    if format == 'txt':
        context = {
            'feasts': feasts,
            'products': products,
            'start_date': DateFormat(start_date).format('l, F jS'),
            'end_date': DateFormat(end_date).format('l, F jS'),
            'latest_pull_date': DateFormat(latest_pull_date).format('l, F jS'),
            'price_per_liter_score_percent': str(int(PRICE_PER_LITER_SCORE_PERCENT * 100)),
            'price_per_size_score_percent': str(int(PRICE_PER_SIZE_SCORE_PERCENT * 100)),
            'deals_min_price_score': DEALS_MIN_PRICE_SCORE,
        }
        return render(request, 'api/templates/email.txt', context)
    else:
        context = {
            'feasts': feasts,
            'products': products,
            'deals': deals,
            'start_date': DateFormat(start_date).format('l, F jS'),
            'end_date': DateFormat(end_date).format('l, F jS'),
            'latest_pull_date': DateFormat(latest_pull_date).format('l, F jS'),
            'price_per_liter_score_percent': str(int(PRICE_PER_LITER_SCORE_PERCENT * 100)),
            'price_per_size_score_percent': str(int(PRICE_PER_SIZE_SCORE_PERCENT * 100)),
            'deals_min_price_score': DEALS_MIN_PRICE_SCORE,
        }
        return render(request, 'api/templates/email.html', context)


class CocktailViewSet(viewsets.ReadOnlyModelViewSet):
    '''
        API Endpoint for Cocktails
    '''
    queryset = Cocktail.objects.all().order_by('name')
    serializer_class = CocktailSerializer
    permission_classes = [permissions.IsAuthenticated]


class FeastViewSet(viewsets.ReadOnlyModelViewSet):
     '''
        API Endpoint for Feasts
     '''
     queryset = Feast.objects.all()
     serializer_class = FeastSerializer
     permission_classes = [permissions.IsAuthenticated]


class AuthorizedPageView(APIView):
    '''
        Adds user data to page resposne.
        This should be inherited, and not called directly.
    '''
    
    def get(self, request, format=None):
        
        user = request.user
        user = UserSerializer(user)

        return Response({'user': user.data})


class DashboardPageView(AuthorizedPageView):
    '''
        Dashboard View
    '''
    def get(self, request, format=None):

        try:
            res = super().get(request, format)
            res.data.update(
                { 'foo': 'bar' },
                status=status.HTTP_200_OK,
            )
            return res
        except:
            return Response(
                { 'error': 'Something went wron when trying to load page data', },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
