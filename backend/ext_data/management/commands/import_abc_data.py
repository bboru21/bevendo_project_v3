from django.core.management.base import BaseCommand
from django.utils import timezone

from ext_data.models import (
    ABCProduct,
    ABCPrice,
)

from ext_data.clients.abc_client import get_product_data


import logging
logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = ''

    from_cache = False
    pull_date = None

    def add_arguments(self, parser):
        parser.add_argument(
            '--from_cache',
            action='store_true',
            help='use cached HTML files for parsing instead of making URL requests (for debugging)',
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=None,
            help='limit URL queryset for debugging',
        )

    def get_price_per_liter(self, amount, unit, price):
        if unit == 'ml':
            amount = amount/1000
        return round(price/amount, 2)

    def process_product_data(self, data):

        url = data.get("url")
        product_data = data.get("product_data")
        status_code = data.get("status_code")

        product = ABCProduct.objects.get(url=url)

        if status_code != 200:
            # deactivate product and log/email the error
            product.active = False
            if not self.from_cache:
                product.save()
            logger.error('{} ({}) url {} returned status code {}'.format(product.name, product.pk, product.url, status_code))

        if product_data:
            product_size = 0
            for item in product_data:
                size = item.get("size")
                size = size.split(' ')

                amount = float(size[0])
                unit = size[1]
                current_price = item.get("currentPrice")
                price_per_liter = self.get_price_per_liter(amount, unit, current_price)

                discount_price = item.get("discountPrice")
                retail_price = item.get("retailPrice")
                size = item.get("size")
                is_on_sale = item.get('onSale')

                p = ABCPrice(
                    product_id = product.pk,
                    size = size,
                    current_price = current_price,
                    price_per_liter = price_per_liter,
                    discount_price = discount_price,
                    retail_price = retail_price,
                    is_on_sale = is_on_sale,
                    pull_date = self.pull_date,
                    product_size = product_size,
                )
                print(p)
                if not self.from_cache:
                    p.save()
                product_size = product_size+1

    def handle(self, *args, **options):

        self.from_cache = options['from_cache']
        self.pull_date = timezone.now()

        urls = list(ABCProduct.objects.filter(active=True).values_list('url', flat=True))[0:options['limit']]

        # # TODO removes me
        # import random
        # urls = random.choices(urls, k=5)

        for url in urls:
            data = get_product_data(url, from_cache=self.from_cache)
            self.process_product_data(data)
