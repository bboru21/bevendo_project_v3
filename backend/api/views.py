import datetime
import logging

from django.db.models import Case, IntegerField, Q, Value, When
from django.shortcuts import render
from django.http import HttpResponse
from django.utils.dateformat import DateFormat
from django.contrib.auth.models import User

from rest_framework import ( permissions, status, viewsets )
from rest_framework.views import APIView
from rest_framework.response import Response


logger = logging.getLogger(__name__)


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


# class CocktailViewSet(viewsets.ReadOnlyModelViewSet):
#     '''
#         API Endpoint for Cocktails
#     '''
#     queryset = Cocktail.objects.all().order_by('name')
#     serializer_class = CocktailSerializer
#     permission_classes = [permissions.IsAuthenticated]


# class FeastViewSet(viewsets.ReadOnlyModelViewSet):
#      '''
#         API Endpoint for Feasts
#      '''
#      queryset = Feast.objects.all()
#      serializer_class = FeastSerializer
#      permission_classes = [permissions.IsAuthenticated]


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

        (start_date, end_date) = get_email_date_range()

        try:
            res = super().get(request, format)

            qs = Feast.objects.filter(_date__range=(start_date, end_date))
            feasts = FeastSerializer(qs, many=True).data

            res.data.update(
                { 'feasts': feasts },
                status=status.HTTP_200_OK,
            )
            return res
        except BaseException as error:
            logger.error(error)
            return Response(
                { 'error': 'Something went wrong when trying to load page data', },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class SearchView(APIView):

    def get(self, request, format=None):

        cocktails = []

        q = request.GET.get('q')
        if q:
            
            q1 = Q(name=q)
            q2 = Q(name__icontains=q)
            q3 = Q(ingredients__ingredient__name=q)
            q4 = Q(ingredients__ingredient__name__icontains=q)

            cocktail_ids = Cocktail.objects \
                .filter(q1 | q2 | q3 | q4) \
                .annotate(
                    search_type_ordering=Case(
                        When(q1, then=Value(3)),
                        When(q2, then=Value(2)),
                        When(q3, then=Value(1)),
                        When(q4, then=Value(0)),
                        default=Value(-1),
                        output_field=IntegerField()
                    )
                ) \
                .order_by('-search_type_ordering') \
                .values_list('id', flat=True) \
                .distinct()

            preserved_order = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(cocktail_ids)])
            qs = Cocktail.objects.filter(id__in=cocktail_ids).order_by(preserved_order)
            
            cocktails = CocktailSerializer(qs, many=True).data

        return Response(
            { 'cocktails': cocktails },
            status=status.HTTP_200_OK,
        )
