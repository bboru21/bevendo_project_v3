import datetime

from django.db import models
from django.contrib.humanize.templatetags.humanize import ordinal

from ext_data.calapi_inadiutorium_models import SEASON_CHOICES

INGREDIENT_MEASUREMENTS = (
    ('bottle', 'bottles'),
    ('cube', 'cubes'),
    ('cup', 'cups'),
    ('dash', 'dashes'),
    ('drop', 'drops'),
    ('jigger', 'jiggers'),
    ('leaf', 'leaves'),
    ('liter', 'liters'),
    ('milliliter', 'milliliters'),
    ('ounce', 'ounces'),
    ('part', 'parts'),
    ('peel', 'peels'),
    ('pint', 'pints'),
    ('pound', 'pounds'),
    ('quart', 'quarts'),
    ('rind', 'rinds'),
    ('scoop', 'scoops'),
    ('slice', 'slices'),
    ('splash', 'splashes'),
    ('spear', 'spears'),
    ('spiral', 'spirals'),
    ('sprig', 'sprigs'),
    ('sprinkle', 'sprinkles'),
    ('stalk', 'stalks'),
    ('tablespoon', 'tablespoons'),
    ('teaspoon', 'teaspoons'),
    ('to taste', 'to taste'),
    ('twist', 'twists'),
    ('wedge', 'wedges'),
    ('wheel', 'wheels'),
    ('whole', 'whole'),
    ('white', 'whites'),
    ('yolk', 'yolks'),
    ('zest', 'zest'),
)

MEASUREMENT_PLURAL_DICT = { singular: plural for (singular, plural) in INGREDIENT_MEASUREMENTS }

MEASUREMENTS_CHOICES = [ (singular, singular.title()) for ( singular, plural) in INGREDIENT_MEASUREMENTS]

PREPARATION_CHOICES = (
    ('broken in half', 'Broken In Half'),
    ('broken up', 'Broken Up'),
    ('chilled', 'Chilled'),
    ('chopped canned', 'Chopped Canned'),
    ('cored', 'Cored'),
    ('cut in pieces', 'Cut In Pieces'),
    ('hollowed out', 'Hollowed Out'),
    ('hot', 'Hot'),
    ('thinly pared', 'Thinly Pared'),
    ('thinly sliced', 'Thinly Sliced'),
    ('sliced', 'Sliced'),
    ('juiced', 'Juiced'),
    ('grated', 'Grated'),
    ('ground', 'Ground'),
    ('warmed', 'Warmed'),
)

'''
    Helpful here: Would you buy it at the store? If so, it's an ingredient. If
    not, it's probably made from an Ingredient.
'''


class Ingredient(models.Model):
    name = models.CharField(max_length=250)
    is_controlled = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']
        app_label = 'api'
        db_table = 'api_ingredient'

    def __str__(self):
        return f'{self.name} ({self.id})'


class ControlledBeverage(models.Model):
    name = models.CharField(max_length=250)
    ingredients = models.ManyToManyField(Ingredient, default=None, blank=True)
    is_in_stock = models.BooleanField(default=False, null=True)

    def __str__(self):
        return f'{self.name} ({self.id})'

    class Meta:
        ordering = ['name']
        verbose_name = 'Controlled Beverage'
        verbose_name_plural = 'Controlled Beverages'
        app_label = 'api'
        db_table = 'api_controlledbeverage'


class CocktailIngredient(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=True,
        blank=True,
        default=None
    )
    measurement = models.CharField(
        max_length=20,
        choices=MEASUREMENTS_CHOICES,
        null=True,
        blank=True,
        default=None,
    )
    preparation = models.CharField(
        max_length=255,
        choices=PREPARATION_CHOICES,
        null=True,
        blank=True,
        default=None,
    )

    def __str__(self):
        parts = []

        if self.amount:
            parts.append(str(self.amount))
        if self.measurement:
            parts.append(self.measurement)
        parts.append(self.ingredient.name)
        if self.preparation:
            parts.append(self.preparation)

        return ' '.join(parts)

    class Meta:
        ordering = ('ingredient__name', 'amount', 'measurement',)
        verbose_name = 'Cocktail Ingredient'
        verbose_name_plural = 'Cocktail Ingredients'
        app_label = 'api'
        db_table = 'api_cocktailingredient'


class Cocktail(models.Model):
    name = models.CharField(max_length=250)
    ingredients = models.ManyToManyField(CocktailIngredient)
    instructions = models.TextField(null=True, blank=None, default=None)

    def __str__(self):
        return f'{self.name} ({self.id})'

    class Meta:
        ordering = ['name']
        app_label = 'api'
        db_table = 'api_cocktail'


class Feast(models.Model):
    _date = models.DateField(
        blank=True,     # admin
        null=True,      # database
        db_column='date',
    )
    name = models.CharField(max_length=250)
    cocktails = models.ManyToManyField(Cocktail, default=None, blank=True)
    ext_calapi_inadiutorium_season = models.CharField(max_length=9, choices=SEASON_CHOICES, null=True, blank=True)
    ext_calapi_inadiutorium_celebration = models.OneToOneField(
        'ext_data.CalapiInadiutoriumCelebration',
        on_delete=models.CASCADE,
        related_name='feast',
        null=True,
        blank=True,
    )

    def __str__(self):
        _str = f"{self.name} ({self.id})"
        if self._date:
            _str = f"{self._date.strftime('%B')} {ordinal(self._date.day)} - {_str}"
        return _str

    class Meta:
        ordering = ['_date']
        app_label = 'api'
        db_table = 'api_feast'

    @property
    def date(self):
        if self._date:
            return self._date
        elif self.ext_calapi_inadiutorium_celebration:
            current_year = datetime.datetime.now().year
            celebration = self.ext_calapi_inadiutorium_celebration

            try:
                liturgical_day = celebration.liturgical_days.get(date__year=current_year)
            except BaseException:
                # should use .get here, but Sacred Heart in 2022 somehow has two days (June 24th and 25th)
                liturgical_day = celebration.liturgical_days.filter(date__year=current_year).first()
            return liturgical_day.date
        return None
