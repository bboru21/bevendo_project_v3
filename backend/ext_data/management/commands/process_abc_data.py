import gc

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


import logging
logger = logging.getLogger(__name__)


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

        chunk_size = 50
        total = ABCProduct.objects.count()

        logger.debug(f"Processing {total} products in chunks of {chunk_size}")

        # batch products to pervent memory leaks
        for i in range(0, total, chunk_size):

            logger.debug(f"Processing chunk {i//chunk_size + 1} of {(total-1)//chunk_size + 1}")
            
            products_chunk = ABCProduct.objects.all()[i:i+chunk_size]
            
            for product in products_chunk:
                data = {
                    'best_price_per_liter': None,
                    'avg_price_per_liter': None,
                }
                for size in ABC_PRODUCT_SIZES:
                    data[format_abc_product_best_column_name(size)] = None
                    data[format_abc_product_avg_column_name(size)] = None

                prices = ABCPrice.objects.filter(product_id=product.id).values_list(
                    'price_per_liter', 
                    'size', 
                    'current_price',
                )


                # historical average price per liter, best price per liter
                price_per_liter_values = [p[0] for p in prices if p[0] is not None]
                if price_per_liter_values:
                    data['avg_price_per_liter'] = sum(price_per_liter_values) / len(price_per_liter_values)
                    data['best_price_per_liter'] = min(price_per_liter_values)

                size_data = {}
                for size in ABC_PRODUCT_SIZES:
                    size_prices = [p[2] for p in prices if p[1] == size and p[2] is not None]
                    if size_prices:
                        data[format_abc_product_best_column_name(size)] = min(size_prices)
                        data[format_abc_product_avg_column_name(size)] = sum(size_prices) / len(size_prices)

                # Update product fields
                for field, value in data.items():
                    setattr(product, field, value)

                # # TODO see if we can prevent listing each best and avg column like this
                # # best price
                # product.best_price_per_liter = data['best_price_per_liter']
                # product.best_price_50_ml = data['best_price_50_ml']
                # product.best_price_100_ml = data['best_price_100_ml']
                # product.best_price_200_ml = data['best_price_200_ml']
                # product.best_price_375_ml = data['best_price_375_ml']
                # product.best_price_473_ml = data['best_price_473_ml']
                # product.best_price_473_18_ml = data['best_price_473_18_ml']
                # product.best_price_750_ml = data['best_price_750_ml']
                # product.best_price_1_l = data['best_price_1_l']
                # product.best_price_1_5_l = data['best_price_1_5_l']
                # product.best_price_1_75_l = data['best_price_1_75_l']

                # # avg price
                # product.avg_price_per_liter = data['avg_price_per_liter']
                # product.avg_price_50_ml = data['avg_price_50_ml']
                # product.avg_price_100_ml = data['avg_price_100_ml']
                # product.avg_price_200_ml = data['avg_price_200_ml']
                # product.avg_price_375_ml = data['avg_price_375_ml']
                # product.avg_price_473_ml = data['avg_price_473_ml']
                # product.avg_price_473_18_ml = data['avg_price_473_18_ml']
                # product.avg_price_750_ml = data['avg_price_750_ml']
                # product.avg_price_1_l = data['avg_price_1_l']
                # product.avg_price_1_5_l = data['avg_price_1_5_l']
                # product.avg_price_1_75_l = data['avg_price_1_75_l']

                print(product)
                product.save()
            
            # force garbage collection after each batch
            gc.collect()

        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        print('process_abc_data script ran', dt_string)
