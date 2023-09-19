import datetime
import logging
import json

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
    FeastSerializer,
    CocktailSerializer,
    IngredientSerializer,
    FavoriteSerializer,
)
from account.serializers import UserSerializer

from .models import (
    Favorite,
    Feast,
    Cocktail,
    Ingredient,
    ControlledBeverage,
)

from .utils import (
    get_feasts_by_date_range,
    get_email_date_range,
    get_email_feasts_products,
    get_email_deals,
    get_date_range,
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

            latest_pull_date = get_latest_price_pull_date()
            deals = get_email_deals(latest_pull_date)

            res.data.update(
                {
                    'feasts': feasts,
                    'deals': deals,
                    'latest_pull_date': latest_pull_date.strftime('%Y-%m-%d'),
                },
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

class FeastsPageView(AuthorizedPageView):
    def get(self, request, format=None):
        res = super().get(request, format)

        try:
            # TODO add prefetch_related('cocktails')
            qs = Feast.objects.all()
            feasts = FeastSerializer(qs, many=True).data
            res.data.update({
                'feasts': feasts,
            }, status=status.HTTP_200_OK)
            return res
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


class IngredientPageView(AuthorizedPageView):
    def get(self, request, slug, format=None):

        res = super().get(request, format)

        try:

            qs = Ingredient.objects.get(slug=slug)
            ingredient = IngredientSerializer(qs, many=False).data

            res.data.update({
                'ingredient': ingredient,
            }, status=status.HTTP_200_OK)
            return res
        except ObjectDoesNotExist:
            return Response({'error': 'Ingredient not found'}, status=status.HTTP_404_NOT_FOUND)
        except BaseException as error:
            logger.error(f'Something went wrong when trying to load page data: {error}')
            return Response(
                { 'error': 'Something went wrong when trying to load page data', },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SearchView(APIView):

    COCKTAIL_LIMIT = 20
    FEAST_LIMIT = 20
    INGREDIENT_LIMIT = 10

    def get(self, request, format=None):



        results = []

        q = request.GET.get('q')
        limit = request.GET.get('limit')
        if limit == 'unlimited':
            self.COCKTAIL_LIMIT = None
            self.FEAST_LIMIT = None
            self.INGREDIENT_LIMIT = None

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
                results.append({ 'label': cocktail.name, 'value': cocktail.urlname, 'type': 'cocktail', 'q': q })

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
                results.append({ 'label': feast.name, 'value': feast.urlname, 'type': 'feast', 'q': q })

            # begin ingredients
            q1 = Q(name=q)
            q2 = Q(name__icontains=q)

            ingredient_ids = Ingredient.objects \
                .filter(is_controlled=True) \
                .filter(q1 | q2) \
                .annotate(
                    search_type_ordering=Case(
                        When(q1, then=Value(3)),
                        When(q2, then=Value(2)),
                        default=Value(-1),
                        output_field=IntegerField()
                    )
                ) \
                .order_by('-search_type_ordering') \
                .values_list('id', flat=True) \
                .distinct()

            preserved_order = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(ingredient_ids)])
            ingredients = Ingredient.objects \
                .filter(id__in=ingredient_ids) \
                .order_by(preserved_order)[:self.INGREDIENT_LIMIT]

            for ingredient in ingredients:
                results.append({ 'label': ingredient.name, 'value': ingredient.urlname, 'type': 'ingredient', 'q': q })

        if len(results) == 0:
            results = [{ 'label': 'No results found.', 'value': None, 'type': None, 'q': q }]

        return Response(
            { 'results': results },
            status=status.HTTP_200_OK,
        )


class FavoriteView(APIView):

    def post(self, request):
        '''
            Adds a cocktail to a user's favorites.
        '''

        try:
            data = request.data

            user = User.objects.get(pk=request.user.pk)
            cocktail = Cocktail.objects.get(pk=data['cocktail_id'])
            favorite = Favorite.objects.filter(cocktail=cocktail, user=user)

            if favorite.exists():
                return Response(
                    {
                        'success': 'Cocktail already added to favorites',
                        'favorites': FavoriteSerializer(user.favorites, many=True).data,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                favorite = Favorite(
                    cocktail=cocktail,
                    user=user,
                )
                favorite.save()
                return Response(
                    {
                        'success': 'Cocktail successfully added to favorites',
                        'favorites': FavoriteSerializer(user.favorites, many=True).data,
                    },
                    status=status.HTTP_201_CREATED,
                )

        except BaseException as error:
            logger.error(f'error occured while adding a favorite: {error}')
            return Response(
                {'error': 'Something went wrong when trying to add a favorite'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request):
        '''
            Removes a cocktail from a user's favorites.
        '''

        try:
            data = request.data

            user = User.objects.get(pk=request.user.pk)
            cocktail = Cocktail.objects.get(pk=data['cocktail_id'])
            favorite = Favorite.objects.filter(cocktail=cocktail, user=user)

            if favorite.exists():
                favorite.delete()
                return Response(
                    {
                        'success': 'Cocktail successfully removed from favorites',
                        'favorites': FavoriteSerializer(user.favorites, many=True).data,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        'success': 'Cocktail is not present within favorites',
                        'favorites': FavoriteSerializer(user.favorites, many=True).data,
                    },
                    status=status.HTTP_200_OK,
                )

        except BaseException as error:
            logger.error(f'error occured while removing a favorite: {error}')
            return Response(
                {'error': 'Something went wrong when trying to remove a favorite'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PriceChartDataView(APIView):
    def get(self, request, pk, format=None):

        '''
        # price chart data
        # TODO can be cleaned up, logic also contained in ext_data.admin, perhaps use pandas as well
        '''

        (start_date, end_date) = get_date_range(years=1)

        qs = ControlledBeverage.objects.get(pk=pk).abc_product.prices.all()

        if start_date and end_date:
            qs = qs.filter(pull_date__range=(start_date, end_date))

        prices = qs.values("current_price", "size", "pull_date").order_by("pull_date")

        pull_dates = []
        data = {}
        for item in prices:
            pull_date = item['pull_date'].strftime("%m/%d/%Y")
            if pull_date not in pull_dates:
                pull_dates.append(pull_date)

            size = item['size']
            current_price = item['current_price']
            if size in data:
                data[size].append(float(current_price))
            else:
                data[size] = [float(current_price)]

        return Response({
            'datasets': [{ 'label': k, 'data': v } for k, v in data.items()],
            'labels': pull_dates,
        }, status=status.HTTP_200_OK)
