import datetime
import logging

from django.core.management import BaseCommand
from django.db import transaction

from ext_data.models import (
    CalapiInadiutoriumLiturgicalDay,
    CalapiInadiutoriumCelebration,
)

from ext_data.calapi_inadiutorium_api import (
    CalapiInadiutoriumDateAPI,
)

from api.utils import nextyear

logger = logging.getLogger(__name__)


class Command(BaseCommand):

    def add_arguments(self, parser):

        parser.add_argument(
            '--month',
            type=int,
            help='month for which to pull data',
            choices=(1,2,3,4,5,6,7,8,9,10,11,12),
        )
        parser.add_argument(
            '--year',
            type=int,
            help='year for which to pull data',
            default=nextyear(datetime.datetime.now()).year,
        )

    def handle(self, **options):

        start_date = datetime.datetime.now()

        api = CalapiInadiutoriumDateAPI()

        if options['month']:
            data = api.get_liturgical_days_by_month(month=options['month'], year=options['year'])
        else:
            data = api.get_liturgical_days_by_year(options['year'])

        logger.debug(data)

        with transaction.atomic():
            for result in data['results']:

                liturgical_day_obj, created = CalapiInadiutoriumLiturgicalDay.objects.update_or_create(
                    date = result['date'],
                    defaults = {
                        'season': result['season'],
                        'season_week': result['season_week'],
                        'weekday': result['weekday'],
                    }
                )

                logger.debug(f'liturgical_day {liturgical_day_obj.pk}, created: {created}')

                celebration_objs = []
                for celebration in result['celebrations']:
                    celebration_obj, created = CalapiInadiutoriumCelebration.objects.update_or_create(
                        title = celebration['title'],
                        defaults = {
                            'colour': celebration['colour'],
                            'rank': celebration['rank'],
                            'rank_num': celebration['rank_num'],
                        },
                    )
                    celebration_objs.append(celebration_obj)

                    logger.debug(f'celebration {celebration_obj.pk}, created: {created}')

                liturgical_day_obj.celebrations.set( celebration_objs )

        runtime_delta = datetime.datetime.now() - start_date

        logger.info(f'import_calapi_inadiutorium_data completed on {start_date.isoformat()} in {str(runtime_delta)}')
