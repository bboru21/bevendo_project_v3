from django.db import models


SEASON_CHOICES = (
    ('ordinary', 'Ordinary Time'),
    ('advent', 'Advent'),
    ('christmas', 'Christmas'),
    ('lent', 'Lent'),
    ('easter', 'Easter'),
)

WEEKDAY_CHOICES = (
    ('sunday', 'Sunday'),
    ('monday', 'Monday'),
    ('tuesday', 'Tuesday'),
    ('wednesday', 'Wednesday'),
    ('thursday', 'Thursday'),
    ('friday', 'Friday'),
    ('saturday', 'Saturday'),
)

COLOUR_CHOICES = (
    ('green', 'Green'),
    ('violet', 'Violet'),
    ('white', 'White'),
    ('red', 'Red'),
)


class BaseModel(models.Model):
    """
        base class Bevendo models

        TODO move to more permanent place, and incorporate elsewhere.
    """
    create_date = models.DateTimeField('create_date', auto_now_add=True, blank=True)
    modified_date = models.DateTimeField('modified_date', auto_now=True, blank=True)

    class Meta:
        abstract = True


class CalapiInadiutoriumLiturgicalDay(BaseModel):
    date = models.DateField()
    season = models.CharField(max_length=9, choices=SEASON_CHOICES)
    season_week = models.IntegerField()
    weekday = models.CharField(max_length=9, choices=WEEKDAY_CHOICES)
    celebrations = models.ManyToManyField(
        'CalapiInadiutoriumCelebration',
        related_name = 'liturgical_days',
    )

    class Meta:
        # db_table = ext_data_calapiinadiutoriumliturgicalday
        ordering = ('date',)

    def __str__(self):
        return f'{self.date.strftime("%b. %d, %Y")}'


class CalapiInadiutoriumCelebration(BaseModel):
    title = models.CharField(max_length=500, null=True)
    colour = models.CharField(max_length=6, choices=COLOUR_CHOICES)
    rank = models.CharField(max_length=255)
    rank_num = models.FloatField()

    class Meta:
        # db_table = ext_data_calapiinadiutoriumcelebration
        ordering = ('rank_num',)

    def __str__(self):
        return f'{self.title}'
