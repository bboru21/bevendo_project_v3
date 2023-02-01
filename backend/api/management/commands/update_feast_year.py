from datetime import datetime

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from api.models import Feast

import logging
logger = logging.getLogger(logging.__class__.__name__)

class Command(BaseCommand):
    help = 'Updates year for all past Feast days'

    def handle(self, *args, **kwargs):

        today = datetime.now()

        feasts = Feast.objects.filter(_date__lt=today)
        _updated = []

        feast_id = None
        past_feast_date = None
        future_feast_date = None

        if feasts.count() == 0:
            logger.info('no past feasts were found to be updated')
            return

        try:
            with transaction.atomic():
                for feast in feasts:

                    feast_id = feast.id
                    past_feast_date = feast._date
                    future_feast_date = past_feast_date.replace(year=past_feast_date.year + 1)

                    feast._date = future_feast_date
                    feast.save()
                    _updated.append(feast.id)

                    logger.debug('{} date {} updated to {}'.format(feast.name, past_feast_date, future_feast_date))
        except IntegrityError as error:
            logger.error('db transation failed updating feast {} from {} to {}: {}'.format(feast_id, past_feast_date, future_feast_date, error))

        logger.info('{} feasts were updated: {}'.format(len(_updated), _updated))
