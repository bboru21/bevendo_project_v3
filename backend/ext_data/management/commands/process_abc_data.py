from django.core.management.base import BaseCommand, CommandError
from ext_data.models import (
    ABCProduct,
    ABCPrice,
    ABC_PRODUCT_SIZES,
    format_abc_product_avg_column_name,
    format_abc_product_best_column_name,
)
from django.db.models import Avg
import re
from datetime import (
    datetime,
)


class Command(BaseCommand):
    help = 'Calculates historical ABC pricing data, updates ABCProduct table'

    def handle(self, *args, **options):
        '''
            Want to know:
            * historical average price
            * where price ranks among sizes all time
            * where price per liter ranks
            * where price per size ranks
        '''

        products = ABCProduct.objects.all()
        for product in products:
            data = {
                'best_price_per_liter': None,
                'avg_price_per_liter': None,
            }
            for size in ABC_PRODUCT_SIZES:
                data[format_abc_product_best_column_name(size)] = None
                data[format_abc_product_avg_column_name(size)] = None

            prices = ABCPrice.objects.filter(product_id=product.id)

            # historical average price per liter
            result = prices.aggregate( Avg('price_per_liter') )
            data['avg_price_per_liter'] = result['price_per_liter__avg']

            best_price_per_size = None

            # historical best price per liter, price per size
            for price in prices:
                if not data['best_price_per_liter'] or price.price_per_liter < data['best_price_per_liter']:
                    data['best_price_per_liter'] = price.price_per_liter

                for size in ABC_PRODUCT_SIZES:
                    if size == price.size:

                        best_column_name = format_abc_product_best_column_name(size)
                        if not data[best_column_name] or price.current_price < data[best_column_name]:
                            data[best_column_name] = price.current_price

                        # historical average price per size
                        avg_column_name = format_abc_product_avg_column_name(size)
                        result = prices.filter(size=size).aggregate( Avg('current_price') )
                        data[avg_column_name] = result['current_price__avg']

            # TODO see if we can prevent listing each best and avg column like this
            # best price
            product.best_price_per_liter = data['best_price_per_liter']
            product.best_price_50_ml = data['best_price_50_ml']
            product.best_price_100_ml = data['best_price_100_ml']
            product.best_price_200_ml = data['best_price_200_ml']
            product.best_price_375_ml = data['best_price_375_ml']
            product.best_price_473_ml = data['best_price_473_ml']
            product.best_price_473_18_ml = data['best_price_473_18_ml']
            product.best_price_750_ml = data['best_price_750_ml']
            product.best_price_1_l = data['best_price_1_l']
            product.best_price_1_5_l = data['best_price_1_5_l']
            product.best_price_1_75_l = data['best_price_1_75_l']

            # avg price
            product.avg_price_per_liter = data['avg_price_per_liter']
            product.avg_price_50_ml = data['avg_price_50_ml']
            product.avg_price_100_ml = data['avg_price_100_ml']
            product.avg_price_200_ml = data['avg_price_200_ml']
            product.avg_price_375_ml = data['avg_price_375_ml']
            product.avg_price_473_ml = data['avg_price_473_ml']
            product.avg_price_473_18_ml = data['avg_price_473_18_ml']
            product.avg_price_750_ml = data['avg_price_750_ml']
            product.avg_price_1_l = data['avg_price_1_l']
            product.avg_price_1_5_l = data['avg_price_1_5_l']
            product.avg_price_1_75_l = data['avg_price_1_75_l']

            product.save()


        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        print('process_abc_data script ran', dt_string)
