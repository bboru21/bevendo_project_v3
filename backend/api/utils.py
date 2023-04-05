import logging
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


def get_email_date_range(start_date=None):

    if not start_date:
        start_date = date.today() + timedelta(days=1)
    end_date = start_date + timedelta(days=7)
    return (start_date, end_date)

def get_email_feasts_products(start_date, end_date, latest_pull_date):

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
                        if hasattr(product, 'abcproduct'):
                            abcproduct = product.abcproduct
                            _product = {
                                'id': abcproduct.id,
                                'name': abcproduct.name,
                            }

                            prices = ABCPrice.objects \
                                        .filter(product=abcproduct) \
                                        .filter(pull_date=latest_pull_date)
                            _prices = []

                            price_index = 0
                            for price in prices:

                                # from time to time, getattr fails here because ABC store changes the sizes
                                # for now, we're OK with it failing because that forces us to update the ABCProduct model
                                best_price_column_name = format_abc_product_best_column_name(price.size)
                                best_price = getattr(abcproduct, best_price_column_name)
                                amount_above_best_price = (price.current_price - best_price) if best_price else 0

                                avg_price_column_name = format_abc_product_avg_column_name(price.size)
                                avg_price_per_size = getattr(abcproduct, avg_price_column_name)

                                if avg_price_per_size:
                                    price_below_average_per_size = avg_price_per_size - price.current_price
                                else:
                                    price_below_average_per_size = 'N/A'

                                _prices.append({
                                    'current_price': price.current_price,
                                    'size': price.size,
                                    'price_below_average_per_liter': (abcproduct.avg_price_per_liter - price.price_per_liter),
                                    'price_below_average_per_size': price_below_average_per_size,
                                    'price_score': price.price_score,
                                    'price_per_liter_score': price.price_per_liter_score,
                                    'is_on_sale': price.is_on_sale,
                                    'url': '{}?productSize={}'.format(abcproduct.url, price_index), # TODO store the actual URL
                                    'amount_above_best_price': amount_above_best_price,
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

    prices = ABCPrice.objects.filter(pull_date=latest_pull_date)
    for price in prices:
        if price.price_score > 70:

            if not limit or price.current_price <= limit:

                avg_price = price.avg_price
                best_price = price.best_price


                avg_price_column_name = format_abc_product_avg_column_name(price.size)
                avg_price_per_size = getattr(price.product, avg_price_column_name)
                price_below_average_per_size = avg_price_per_size - price.current_price

                deals.append({
                    'name': price.product.name,
                    'size': price.size,
                    'current_price': price.current_price,
                    'is_on_sale': price.is_on_sale,
                    'price_below_average': (avg_price - price.current_price),
                    'price_below_average_per_size': price_below_average_per_size,
                    'score': price.price_score,
                    'is_best_price': best_price==price.current_price,
                    'product_size': price.product_size,
                    'url': price.product.url,
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
