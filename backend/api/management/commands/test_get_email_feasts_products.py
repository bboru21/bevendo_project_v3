import logging
import unittest
from datetime import (
    datetime,
    timedelta,
)

from django.core.management import BaseCommand

from ext_data.models import (
    get_latest_price_pull_date,
)

from api.utils import get_email_feasts_products


logger = logging.getLogger(__name__)


class Command(BaseCommand):

    help='tests the get_email_feasts_products utility method over weekly intervals of time'

    def add_arguments(self, parser):

        parser.add_argument(
            '--days',
            type=int,
            help='number of days into the future for which to run the test',
            default=365,
        )

    def handle(self, *args, **options):

        # TODO find other non-unittest methods we can use
        tc = unittest.TestCase()

        current_date = datetime.now().date()
        terminal_date = current_date + timedelta(days=options['days'])

        current_weekday = current_date.isoweekday()
        days_till_saturday = (6 - current_weekday)

        start_date = current_date + timedelta(days=days_till_saturday)
        end_date = start_date + timedelta(days=6)

        latest_pull_date = get_latest_price_pull_date()

        while start_date < terminal_date:

            response = get_email_feasts_products(start_date, end_date, latest_pull_date)

            tc.assertIsInstance(response, tuple)
            tc.assertTrue(len(response) == 2)

            # TODO add tests once we confirm we have enough feasts for every week
            # tc.assertTrue(len(response[0]) > 0)
            # tc.assertTrue(len(response[1]) > 0)
            logger.debug(f'total feasts: {len(response[0])}, total products: {len(response[1])}, period: {str(start_date)}-{str(end_date)}')

            start_date = end_date + timedelta(days=1)
            end_date = start_date + timedelta(days=6)

        logger.info('test of get_email_feasts_products complete')
