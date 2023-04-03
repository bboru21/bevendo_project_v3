from datetime import datetime

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify
from django.db.utils import DataError, IntegrityError
from django.db.models import Count

from api.models import (
    Cocktail,
    ControlledBeverage,
    Feast,
    Ingredient,
)

import logging
logger = logging.getLogger(logging.__class__.__name__)

class Command(BaseCommand):
    help = 'one-time command for populating slugs into already existing Feast, Ingredient, Cocktail and ControlledBeverage entries'

    def add_arguments(self, parser):
        parser.add_argument(
            '--check_names',
            action='store_true',
            help='check for duplicate name columns on relavant models',
        )
        parser.add_argument(
            '--update',
            action='store_true',
            help='update slug fields within atomic transaction',
        )

    def handle(self, *args, **kwargs):

        if kwargs['check_names']:

            # check for duplicates that should be manually resolved before proceeding
            qs = Cocktail.objects.values('name') \
                .annotate(Count('id')) \
                .filter(id__count__gt=1)
            for item in qs:
                print(item)
            
            qs = ControlledBeverage.objects.values('name') \
                .annotate(Count('id')) \
                .filter(id__count__gt=1)
            for item in qs:
                print(item)

            qs = Feast.objects.values('name') \
                .annotate(Count('id')) \
                .filter(id__count__gt=1)
            for item in qs:
                print(item)
            
            qs = Ingredient.objects.values('name') \
                .annotate(Count('id')) \
                .filter(id__count__gt=1)
            for item in qs:
                print(item)

        if kwargs['update']:
            try:
                with transaction.atomic():
                    for item in Cocktail.objects.all():
                        if item.slug is None:
                            item.save()

                    for item in ControlledBeverage.objects.all():
                        if item.slug is None:
                            item.save()

                    for item in Feast.objects.all():
                        if item.slug is None:
                            item.save()

                    for item in Ingredient.objects.all():
                        if item.slug is None:
                            item.save()
            except DataError as error:
                print(error, item.pk, item.name)
            except IntegrityError as error:
                print(error, item.pk, item.name)
