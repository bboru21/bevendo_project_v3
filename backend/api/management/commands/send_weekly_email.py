import logging
import re

from django.contrib.auth.models import User
from django.core import management
from django.core.management.base import BaseCommand, CommandError
from django.utils.dateformat import DateFormat
from django.conf import settings
from django.db.models import Max
from api.models import (
    Feast,
    ControlledBeverage,
)
from ext_data.models import (
    ABCPrice,
    format_abc_product_best_column_name,
    get_latest_price_pull_date,
)
# from util.util import Email
from datetime import (
    timedelta,
    datetime,
    date,
)

from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

from api.utils import (
    get_email_date_range,
    get_email_feasts_products,
    get_email_deals,
)

from api.constants import (
    PRICE_PER_SIZE_SCORE_PERCENT,
    PRICE_PER_LITER_SCORE_PERCENT,
    DEALS_MIN_PRICE_SCORE,
)


logger = logging.getLogger(__name__)


def _validate_isodate(s):
    if isinstance(s, str) and re.fullmatch(r'\d{4}\-\d{2}\-\d{2}', s, flags=re.ASCII):
        return s
    raise TypeError


class Command(BaseCommand):
    help = 'Sends an e-mail with Drinking with the Saints Cocktail Recomendations'

    def add_arguments(self, parser):
        parser.add_argument(
            '--start_date',
            type=_validate_isodate,
            help='start_date string in isoformat, for debugging',
        )
        parser.add_argument(
            '--end_date',
            type=_validate_isodate,
            help='end_date string in isoformat, for debugging',
        )
        parser.add_argument(
            '--group_name',
            type=str,
            help='name of the group to send the e-mail to',
            default='Weekly E-Mail',
        )

    def handle(self, *args, **options):

        # update the year of all past feast dates
        management.call_command('update_feast_year')

        (_start_date, _end_date) = get_email_date_range()

        if options['start_date']:
            start_date = date.fromisoformat(options['start_date'])
        else:
            start_date = _start_date

        if options['end_date']:
            end_date = date.fromisoformat(options['end_date'])
        else:
            end_date = _end_date

        latest_pull_date = get_latest_price_pull_date()

        ( feasts, products ) = get_email_feasts_products(start_date, end_date, latest_pull_date)
        if len(feasts) == 0:
            logger.warn('get_email_feasts_products returned no feasts, no e-mail will be sent')
        else:

            users = User.objects.filter(groups__name=options['group_name']).filter(is_active=True)
            recipient_list = list(users.values_list('email', flat=True))

            deals = get_email_deals(latest_pull_date)

            message = render_to_string('api/templates/email.txt', {
                'feasts': feasts,
                'products': products,
                'start_date': DateFormat(start_date).format('l, F jS'),
                'end_date': DateFormat(end_date).format('l, F jS'),
                'latest_pull_date': DateFormat(latest_pull_date).format('l, F jS'),
                'price_per_liter_score_percent': str(int(PRICE_PER_LITER_SCORE_PERCENT * 100)),
                'price_per_size_score_percent': str(int(PRICE_PER_SIZE_SCORE_PERCENT * 100)),
                'deals_min_price_score': DEALS_MIN_PRICE_SCORE,
            })

            html_message = render_to_string('api/templates/email.html', {
                'feasts': feasts,
                'products': products,
                'deals': deals,
                'start_date': DateFormat(start_date).format('l, F jS'),
                'end_date': DateFormat(end_date).format('l, F jS'),
                'latest_pull_date': DateFormat(latest_pull_date).format('l, F jS'),
                'price_per_liter_score_percent': str(int(PRICE_PER_LITER_SCORE_PERCENT * 100)),
                'price_per_size_score_percent': str(int(PRICE_PER_SIZE_SCORE_PERCENT * 100)),
                'deals_min_price_score': DEALS_MIN_PRICE_SCORE,
            })

            msg = EmailMultiAlternatives(
                subject='Bevendo: Your Weekly Drinking with the Saints Cocktails',
                body=message,
                from_email=settings.SENDER_EMAIL,
                bcc=recipient_list,
            )
            msg.attach_alternative(html_message, 'text/html')
            success = msg.send()

            # print(success)

        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        logger.info(f'send_cocktail_recommendations script ran {dt_string}')
