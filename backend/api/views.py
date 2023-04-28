import datetime
import logging

from django.db.models import Case, IntegerField, Q, Value, When
from django.shortcuts import render
from django.http import HttpResponse
from django.utils.dateformat import DateFormat
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

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
    Favorite,
    Feast,
    Cocktail,
)

from .utils import (
    get_feasts_by_date_range,
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

            qs = get_feasts_by_date_range(start_date, end_date)
            # TODO add prefetch_related('cocktails')
            feasts = FeastSerializer(qs, many=True).data

            res.data.update(
                { 'feasts': feasts },
                status=status.HTTP_200_OK,
            )
            return res
        except BaseException as error:
            logger.error(f'Something went wrong when trying to load page data: {error}')
            return Response(
                { 'error': 'Something went wrong when trying to load page data', },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class FeastPageView(AuthorizedPageView):
    def get(self, request, slug, format=None):
        res = super().get(request, format)

        try:
            # TODO add prefetch_related('cocktails')
            qs = Feast.objects.get(slug=slug)
            feast = FeastSerializer(qs, many=False).data
            res.data.update({
                'feast': feast,
            }, status=status.HTTP_200_OK)
            return res
        except ObjectDoesNotExist:
            return Response({'error': 'Feast not found'}, status=status.HTTP_404_NOT_FOUND)
        except BaseException as error:
            logger.error(f'Something went wrong when trying to load page data: {error}')
            return Response(
                { 'error': 'Something went wrong when trying to load page data', },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CocktailPageView(AuthorizedPageView):
    def get(self, request, slug, format=None):
        res = super().get(request, format)

        try:
            # TODO add prefetch_related('feasts') and prefetch_related('ingredients')
            qs = Cocktail.objects.get(slug=slug)
            cocktail = CocktailSerializer(qs, many=False).data

            res.data.update({
                'cocktail': cocktail,
            }, status=status.HTTP_200_OK)
            return res
        except ObjectDoesNotExist:
            return Response({'error': 'Cocktail not found'}, status=status.HTTP_404_NOT_FOUND)
        except BaseException as error:
            logger.error(f'Something went wrong when trying to load page data: {error}')
            return Response(
                { 'error': 'Something went wrong when trying to load page data', },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SearchView(APIView):

    COCKTAIL_LIMIT = 25
    FEAST_LIMIT = 25

    def get(self, request, format=None):

        results = []

        q = request.GET.get('q')
        if q:

            # begin cocktails
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
            cocktails = Cocktail.objects \
                .filter(id__in=cocktail_ids) \
                .order_by(preserved_order)[:self.COCKTAIL_LIMIT]

            for cocktail in cocktails:
                results.append({ 'label': cocktail.name, 'value': cocktail.urlname })

            # begin feasts
            q1 = Q(name=q)
            q2 = Q(name__icontains=q)

            feast_ids = Feast.objects \
                .filter(q1 | q2) \
                .annotate(
                    search_type_ordering=Case(
                        When(q1, then=Value(1)),
                        When(q2, then=Value(0)),
                        default=Value(-1),
                        output_field=IntegerField()
                    )
                ) \
                .order_by('-search_type_ordering') \
                .values_list('id', flat=True) \
                .distinct()

            preserved_order = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(feast_ids)])
            feasts = Feast.objects \
                .filter(id__in=feast_ids) \
                .order_by(preserved_order)[:self.FEAST_LIMIT]

            for feast in feasts:
                results.append({ 'label': feast.name, 'value': feast.urlname })

        return Response(
            { 'results': results },
            status=status.HTTP_200_OK,
        )


class FavoriteView(APIView):

    def post(self, request):
        '''
            Adds/removes a cocktail from a users favorites.

            TODO:
            * determine if insert/delete functionality should be seperated
        '''

        try:
            data = request.data

            user = User.objects.get(pk=request.user.pk)
            cocktail = Cocktail.objects.get(pk=data['cocktail_id'])
            favorite = Favorite.objects.filter(cocktail=cocktail, user=user)

            if favorite.exists():
                favorite.delete()
                return Response(
                    { 'success': 'Cocktail successfully removed from favorites' },
                    status=status.HTTP_200_OK,
                )
            else:
                favorite = Favorite(
                    cocktail=cocktail,
                    user=user,
                )
                favorite.save()
                return Response(
                    { 'success': 'Cocktail successfully added to favorites' },
                    status=status.HTTP_201_CREATED,
                )

        except BaseException as error:
            logger.error(f'error occured while adding a favorite: {error}')
            return Response(
                {'error': 'Something went wrong when trying to add a favorite'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
