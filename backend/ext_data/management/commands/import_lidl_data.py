import json
import logging
from pathlib import Path
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

from django.core.management.base import BaseCommand
from django.utils import timezone

from ext_data.models import (
    LidlProduct,
    LidlProductPrice,
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
            help='use cached JSON files for parsing instead of making URL requests (for debugging)',
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=None,
            help='limit URL queryset for debugging',
        )

    def parse_scrapy_response(self, response):

        product = LidlProduct.objects.get(url=response.url)

        if response.status != 200:
            # deactivate product and log/email the error
            product.active = False
            if not self.cache:
                product.save()
            logger.error('{} ({}) url {} returned status code {}'.format(product.name, product.pk, product.url, response.status))

        if not self.cache:
            urlname = response.url.split('/')[-1]
            filename = f'{urlname}.json'
            filepath = f'{self.cache_path}/{filename}'

            with open(filepath, 'wb') as f:
                f.write(response.body)

        data = json.loads(response.text)
        if data:
            priceData = data.get('price', {})
            if 'currentPrice' in priceData:
                current_price = priceData['currentPrice']['value']

                p = LidlProductPrice(
                    product_id = product.pk,
                    current_price = current_price,
                    pull_date = self.pull_date,
                )
                if not self.cache:
                    p.save()

    def handle(self, *args, **options):

        self.cache = options['cache']
        self.pull_date = timezone.now()

        start_urls = []

        urls = list(LidlProduct.objects.values_list('url', flat=True))[0:options['limit']]

        if self.cache:
            for url in urls:
                urlname = url.split('/')[-1]

                p = self.cache_path / f'{urlname}.json'
                if p.exists():
                    start_urls.append(f'file://{p}')

        else:
            start_urls = urls

        process = CrawlerProcess(get_project_settings())
        process.crawl(
            BaseSpider,
            start_urls=urls,
            parse=self.parse_scrapy_response,
        )
        process.start()
