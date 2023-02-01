from django.db import models


class LidlProduct(models.Model):
    name = models.CharField(max_length=250, null=True, blank=True, default=None)
    ext_id = models.IntegerField(unique=True)
    url = models.CharField(max_length=1855)

    def __str__(self):
        return f'{self.name} ({self.id})'

    class Meta:
        verbose_name = 'Lidl Product'
        verbose_name_plural = 'Lidl Products'
        app_label = 'ext_data'

class LidlProductPrice(models.Model):
    product = models.ForeignKey(LidlProduct, on_delete=models.CASCADE)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    pull_date = models.DateTimeField('date of price pull')

    def __str__(self):
        return f'{self.product.name} (${self.current_price})'

    class Meta:
        verbose_name = 'Lidl Product Price'
        verbose_name_plural = 'Lidl Product Prices'
        app_label = 'ext_data'
