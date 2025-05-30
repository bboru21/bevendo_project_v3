import logging
import re
from datetime import (
    date,
    timedelta,
    datetime,
)
from fractions import Fraction
import math

from django.utils.dateformat import DateFormat

from .models import (
    Feast,
    ControlledBeverage,
)
from ext_data.models import (
    ABCPrice,
    format_abc_product_avg_column_name,
    format_abc_product_best_column_name,
    CalapiInadiutoriumLiturgicalDay,
)

from .constants import DEALS_MIN_PRICE_SCORE

logger = logging.getLogger(__name__)


def get_feasts_by_date_range(start_date, end_date):
    feast_ids = []

    # new feast logic to incorporate seasons and floating feast days
    liturgical_days = CalapiInadiutoriumLiturgicalDay.objects \
        .filter(date__range=(start_date, end_date))

    seasons = list(
        set(
            liturgical_days \
                .values_list('season', flat=True)
        )
    )

    feast_ids += list(Feast.objects.filter(ext_calapi_inadiutorium_season__in=seasons).values_list('pk', flat=True))
    feast_ids += list(Feast.objects.filter(_date__range=(start_date, end_date)).values_list('pk', flat=True))

    for liturgical_day in liturgical_days:
        feast_ids += list(liturgical_day.celebrations.exclude(feast__isnull=True).values_list('feast__pk', flat=True))

    # resort according to the date property
    feasts = sorted(
        Feast.objects.filter(pk__in=feast_ids),
        key=lambda f: f.date if f.date else datetime.strptime('1900-01-01', '%Y-%m-%d').date(),
    )

    return feasts

def get_date_range(days=None, months=None, years=None):
    # used by PriceChartDataView

    start_date = end_date = date.today()

    if days:
        start_date = end_date - timedelta(days=days)
    elif months:
        start_date = end_date - timedelta(days=(31 * months))
    elif years:
        start_date = end_date - timedelta(days=(365 * years))

    return (start_date, end_date)

def get_email_date_range(start_date=None):

    if not start_date:
        start_date = date.today()
    end_date = start_date + timedelta(days=8)
    return (start_date, end_date)

def get_email_feasts_products(start_date, end_date, latest_pull_date):

    # TODO use prefetch related
    feasts = get_feasts_by_date_range(start_date, end_date)

    _feasts = []
    _products = []
    _unique_product_ids = []

    for feast in feasts:

        feast_date = DateFormat(feast.date).format('F jS') if feast.date else None

        _feast = {
            'name': feast.name,
            'date': feast_date,
            'url': f'https://www.catholicculture.org/culture/liturgicalyear/calendar/day.cfm?date={feast.date.strftime("%Y-%m-%d")}' if feast.date else None,
        }

        cocktails = feast.cocktails.all()

        _cocktails = []
        for cocktail in cocktails:

            _cocktail = {
                'name': cocktail.name,
                'instructions': cocktail.instructions,
            }

            _ingredients = []

            cocktail_ingredients = cocktail.ingredients.all()

            for cocktail_ingredient in cocktail_ingredients:

                ingredient = cocktail_ingredient.ingredient
                if ingredient.is_controlled:

                    products = ControlledBeverage.objects \
                                .filter(ingredients__in=[ingredient.pk])

                    _ingredient = {
                        'name': ingredient.name,
                        'is_controlled': True,
                        'amount': cocktail_ingredient.amount,
                        'measurement': cocktail_ingredient.measurement,
                        'preparation': cocktail_ingredient.preparation,
                    }
                    # print(ingredient, products)
                    for product in products:

                        # print(product.name)
                        if hasattr(product, 'abc_product'):
                            abc_product = product.abc_product
                            _product = {
                                'id': abc_product.id,
                                'name': abc_product.name,
                            }

                            prices = ABCPrice.objects \
                                        .filter(product=abc_product) \
                                        .filter(pull_date=latest_pull_date)
                            _prices = []

                            price_index = 0
                            for price in prices:
                                _prices.append({
                                    'current_price': price.current_price,
                                    'size': price.size,
                                    'price_below_average_per_liter': price.price_below_average_per_liter,
                                    'price_below_average_per_size': price.price_below_average_per_size,
                                    'price_score': price.price_score,
                                    'price_per_liter_score': price.price_per_liter_score,
                                    'is_on_sale': price.is_on_sale,
                                    'url': '{}?productSize={}'.format(abc_product.url, price_index), # TODO store the actual URL
                                    'amount_above_best_price': price.amount_above_best_price,
                                    'price_per_liter': price.price_per_liter,
                                })
                                price_index = price_index+1
                                _prices.sort(key=lambda item: item['price_score'], reverse=True)

                            _product['prices'] = _prices

                            # prevent duplicates
                            if _product['id'] not in _unique_product_ids:
                                _products.append(_product)
                                _unique_product_ids.append(_product['id'])

                    _ingredients.append(_ingredient)
                else:
                    _ingredients.append({
                        'name': ingredient.name,
                        'is_controlled': False,
                        'amount': cocktail_ingredient.amount,
                        'measurement': cocktail_ingredient.measurement,
                        'preparation': cocktail_ingredient.preparation,
                    })

            _cocktail['ingredients'] = _ingredients
            _cocktails.append(_cocktail)

        _feast['cocktails'] = _cocktails
        _feasts.append(_feast)
    return ( _feasts, _products )

def get_email_deals(latest_pull_date):

    # duplicate logic between here and send_abc_deals, find one place for it to live
    limit = None
    deals = []

    prices = ABCPrice.objects.filter(pull_date=latest_pull_date).values_list(
        'product__name',
        'size',
        'current_price',
        'is_on_sale',
        'price_below_average',
        'price_below_average_per_size',
        'price_score',
        'is_best_price',
        'product_size',
        'product__url',
    )

    for price in prices:

        product_name = price[0]
        size = price[1]
        current_price = price[2]
        is_on_sale = price[3]
        price_below_average = price[4]
        price_below_average_per_size = price[5]
        price_score = price[6]
        is_best_price = price[7]
        product_size = price[8]
        url = price[9]

        if price_score > 70:

            if not limit or current_price <= limit:

                deals.append({
                    'name': product_name,
                    'size': size,
                    'current_price': current_price,
                    'is_on_sale': is_on_sale,
                    'price_below_average': price_below_average,
                    'price_below_average_per_size': price_below_average_per_size,
                    'score': price_score,
                    'is_best_price': is_best_price,
                    'product_size': product_size,
                    'url': url,
                })

    deals = sorted(deals, key = lambda i: i['price_below_average'], reverse=True)

    return deals


def nextyear(dt):
   try:
       return dt.replace(year=dt.year+1)
   except ValueError:
       # February 29th in a leap year
       # Add 365 days instead to arrive at March 1st
       return dt + timedelta(days=365)


"""
    Substracts common strings from the Feast name which are not desired to be factored into sorting.
"""
def get_sortable_feast(name):
    return re.sub('^(Bl\.|St\.|The|Feast of)', '', name).strip()


"""
    Substracts common strings from the Cocktail name which are not desired to be factored into sorting.
"""
def get_sortable_cocktail(name):
    name = re.sub('[\(\)]', '', name)
    name = re.sub('(St\-|St\.\s)', 'St ', name)
    return name
