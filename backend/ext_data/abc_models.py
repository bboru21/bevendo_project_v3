import logging
import re

from django.db import models
from django.db.models import Max

from api.models import ControlledBeverage
from api.constants import (
    PRICE_PER_SIZE_SCORE_PERCENT,
    PRICE_PER_LITER_SCORE_PERCENT,
)


logger = logging.getLogger(__name__)

ABC_PRODUCT_SIZES = (
    '50 ml',
    '100 ml',
    '118 ml',
    '200 ml',
    '375 ml',
    '473 ml',
    '473 18 ml',
    '750 ml',
    '1 L',
    '1.5 L',
    '1.75 L',
)


def format_abc_product_best_column_name(s):
    return 'best_price_%s' % re.sub('[^0-9a-zA-Z]+', '_', s).lower()


def format_abc_product_avg_column_name(s):
    return 'avg_price_%s' % re.sub('[^0-9a-zA-Z]+', '_', s).lower()


class ABCProduct(models.Model):
    name = models.CharField(max_length=250, null=True, blank=True, default=None)
    url = models.CharField(max_length=1855)
    avg_price_per_liter = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    best_price_per_liter = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)

    best_price_50_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    best_price_100_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    best_price_118_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    best_price_200_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    best_price_375_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    best_price_473_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    best_price_473_18_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    best_price_750_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    best_price_1_l = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    best_price_1_5_l = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    best_price_1_75_l = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)

    avg_price_50_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    avg_price_100_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    avg_price_118_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    avg_price_200_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    avg_price_375_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    avg_price_473_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    avg_price_473_18_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    avg_price_750_ml = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    avg_price_1_l = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    avg_price_1_5_l = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)
    avg_price_1_75_l = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None, blank=True)

    controlled_beverage = models.OneToOneField(
        ControlledBeverage,
        on_delete=models.SET_NULL,
        null=True,
        related_name="abc_product",
    )

    active = models.BooleanField(default=True, null=False)

    def __str__(self):
        if self.name:
            return '{} ({})'.format(self.name, self.id)
        elif self.parent:
            return '{} ({})'.format(self.parent.name, self.id)
        return str(self)

    class Meta:
        verbose_name = 'ABC Product'
        verbose_name_plural = 'ABC Products'
        app_label = 'ext_data'


class ABCPrice(models.Model):
    product = models.ForeignKey(
        ABCProduct,
        on_delete=models.CASCADE,
        related_name="prices",
    )
    size = models.CharField(max_length=250, null=True, default=None)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_liter = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None)
    retail_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    is_on_sale = models.BooleanField(default=False)
    pull_date = models.DateTimeField('date of price pull')
    product_size = models.IntegerField(null=True, default=None)

    class Meta:
        app_label = 'ext_data'

    @property
    def price_per_liter_score(self):
        '''
            Scale is: high of best price, low of average price. Anything below average is zero.
        '''
        if self.price_per_liter > self.product.avg_price_per_liter:
            return 0

        # difference between this price and best price
        diff1 = (self.price_per_liter - self.product.best_price_per_liter)

        # difference between average price and best price
        diff2 = (self.product.avg_price_per_liter - self.product.best_price_per_liter)

        if diff1+diff2 == 0:
            return 1

        return round((diff2-diff1)/diff2*100)

    @property
    def best_price(self):
        '''
            Best price per size of bottle.
        '''
        column_name = format_abc_product_best_column_name(self.size)
        best_price = None
        try:
            best_price = getattr(self.product, column_name)
        except AttributeError as error:
            print(error, self.product.name, self.size, column_name)
        if not best_price:
            best_price = self.current_price
        return best_price

    @property
    def avg_price(self):
        column_name = format_abc_product_avg_column_name(self.size)
        avg_price = None

        try:
            avg_price = getattr(self.product, column_name)
        except AttributeError as error:
            print(error, self.product.name, self.size, column_name)
        if not avg_price:
            avg_price = self.current_price

        return avg_price

    @property
    def price_per_size_score(self):
        '''
            If price os this size is equal to best price for this size, return
            max score. If not, calculate the percentage of difference and
            subtract that from max score.
        '''

        current_price = self.current_price
        best_price = self.best_price
        avg_price = self.avg_price

        if current_price > avg_price:
            return 0

        # difference between this price and best price
        diff1 = (current_price - best_price)

        # difference between average price and best price
        diff2 = (avg_price - best_price)

        if diff1+diff2 == 0:
            return 1

        return round((diff2-diff1)/diff2*100)

    @property
    def price_score(self):
        return round((self.price_per_size_score * PRICE_PER_SIZE_SCORE_PERCENT) + (self.price_per_liter_score * PRICE_PER_LITER_SCORE_PERCENT))

    @property
    def price_per_liter_score_class_name(self):
        '''
        Bootstrap button classses
        '''
        if 1 <= self.price_score <= 33:
            return 'btn-warning'  # fair-deal
        elif 34 <= self.price_score <= 66:
            return 'btn-secondary'  # good deal
        elif 67 <= self.price_score <= 99:
            return 'btn-dark'  # great deal
        elif self.price_score == 100:
            return 'btn-success'  # best deal
        else:
            return 'btn-danger'  # worst deal

    @classmethod
    def get_latest_price_pull_date(self):
        result = self.objects.aggregate(Max('pull_date'))
        return result['pull_date__max']

    @classmethod
    def get_deals(self, limit=None):

        deals = []

        latest_pull_date = self.get_latest_price_pull_date()

        # print(pull_date)

        prices = self.objects.filter(pull_date=latest_pull_date)
        for price in prices:
            if price.price_score > 90:
                if not limit or price.current_price <= limit:

                    avg_price = price.avg_price
                    best_price = price.best_price

                    deals.append({
                        'name': price.product.name,
                        'size': price.size,
                        'current_price': price.current_price,
                        'is_on_sale': price.is_on_sale,
                        'price_below_average': (avg_price - price.current_price),
                        'score': price.price_score,
                        'is_best_price': best_price == price.current_price,
                        'product_size': price.product_size,
                        'url': price.product.url,
                    })

        deals = sorted(deals, key=lambda i: i['price_below_average'], reverse=True)
        # deals = sorted(deals, key = lambda i: i['score'])

        return deals

    @property
    def url(self):
        url = self.product.url
        if self.product_size:
            url = f'{url}?productSize={self.product_size}'
        return url

    @property
    def amount_above_best_price(self):
        best_price_column_name = format_abc_product_best_column_name(self.size)
        # from time to time, getattr fails here because ABC store changes the sizes
        # for now, we're OK with it failing because that forces us to update the ABCProduct model
        try:
            best_price = getattr(self.product, best_price_column_name)
        except AttributeError:
            best_price = None
            logger.error(f'{self.product.name} ({self.product.id}) has new size {best_price_column_name} which has not been added to the Product model.')

        return (self.current_price - best_price) if best_price else 0

    @property
    def price_below_average_per_size(self):


        avg_price_column_name = format_abc_product_avg_column_name(self.size)
        # from time to time, getattr fails here because ABC store changes the sizes
        # for now, we're OK with it failing because that forces us to update the ABCProduct model

        try:
            avg_price_per_size = getattr(self.product, avg_price_column_name)
        except AttributeError:
            avg_price_per_size = None
            logger.error(f'{self.product.name} ({self.product.id}) has new size {avg_price_column_name} which has not been added to the Product model.')

        return (avg_price_per_size - self.current_price) if avg_price_per_size else None

    @property
    def price_below_average(self):
        return (self.avg_price - self.current_price)

    @property
    def price_below_average_per_liter(self):
        return (self.product.avg_price_per_liter - self.price_per_liter)

    @property
    def is_best_price(self):
        # should never be less, but just in case...
        return self.best_price >= self.current_price

    def __str__(self):
        return '{} ({}) - ${} (${}/liter)'.format(
            self.product.name,
            self.size,
            self.current_price,
            self.price_per_liter,
        )


# TODO look to integrate this with ABCPrice model one
def get_latest_price_pull_date():
    result = ABCPrice.objects.aggregate(Max('pull_date'))
    return result['pull_date__max']
