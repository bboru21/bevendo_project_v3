import json
import logging
from pathlib import Path
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

from django.core.management.base import BaseCommand
from django.utils import timezone

from ext_data.models import (
    ABCProduct,
    ABCPrice,
)

from ..scraper.scraper.spiders.base import BaseSpider

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = ''

    cache = False
    cache_path = Path(__file__).resolve().parent.parent / 'scraper' / 'scraper' / 'spiders' / '_cache'
    pull_date = None

    def add_arguments(self, parser):
        parser.add_argument(
            '--cache',
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

    def parse_scrapy_response(self, response):

        product = ABCProduct.objects.get(url=response.url)

        if response.status != 200:
            # deactivate product and log/email the error
            product.active = False
            if not self.cache:
                product.save()
            logger.error('{} ({}) url {} returned status code {}'.format(product.name, product.pk, product.url, response.status))

        if not self.cache:
            urlname = response.url.split('/')[-1]
            filename = f'{urlname}.html'
            filepath = f'{self.cache_path}/{filename}'

            with open(filepath, 'wb') as f:
                f.write(response.body)

        json_data = response.css('#productData').attrib['data-skus']
        data = json.loads(json_data)

        if data:
            product_size = 0
            for item in data:
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
                if not self.cache:
                    p.save()
                product_size = product_size+1

    def handle(self, *args, **options):

        self.cache = options['cache']
        self.pull_date = timezone.now()

        start_urls = []

        urls = list(ABCProduct.objects.filter(active=True).values_list('url', flat=True))[0:options['limit']]

        if self.cache:
            for url in urls:
                urlname = url.split('/')[-1]

                p = self.cache_path / f'{urlname}.html'
                if p.exists():
                    start_urls.append(f'file://{p}')

        else:
            start_urls = urls

        '''
            Currently scraper settings.py aren't found by get_project_settings.
            This is likely because of the current directory structure, and that
            no SCRAPY_SETTINGS_MODULE env var is present.
            Will have to look into a more full proof solution for the future.
            This will fix the current 403 response issues.
        '''
        settings = get_project_settings()
        settings['USER_AGENT'] = 'scraper (+http://bevendo.online)'

        process = CrawlerProcess(settings)
        process.crawl(
            BaseSpider,
            start_urls=urls,
            parse=self.parse_scrapy_response,
        )
        process.start()
