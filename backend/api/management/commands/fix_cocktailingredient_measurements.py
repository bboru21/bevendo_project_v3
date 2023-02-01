from django.core.management import BaseCommand

from api.models import (
    CocktailIngredient,
    PREPARATION_CHOICES,
)

MEASUREMENTS_TO_FIX = [x[0] for x in PREPARATION_CHOICES]


class Command(BaseCommand):

    help = 'one-time command to fix CocktailIngredient objects that had measurements that were really preparation instructions'

    def add_arguments(self, parser):

        parser.add_argument(
            '--save',
            action='store_true',
            help='save changes to datbase',
            default=False,
        )

    def handle(self, *args, **options):

        ingredients = CocktailIngredient.objects.filter(measurement__in=MEASUREMENTS_TO_FIX)

        for ingredient in ingredients:
            preparation = ingredient.measurement
            ingredient.preparation = preparation
            ingredient.measurement = 'whole'

            print(ingredient)

            if options['save']:
                ingredient.save()

        print('finis')
