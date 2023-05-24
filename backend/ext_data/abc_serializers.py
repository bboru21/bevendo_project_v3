from rest_framework import serializers

from .models import (
    ABCPrice,
)


class ABCPriceSerializer(serializers.ModelSerializer):

    class Meta:
        model = ABCPrice
        fields = (
          'amount_above_best_price',
          'current_price',
          'is_best_price',
          'is_on_sale',
          'price_below_average_per_liter',
          'price_below_average_per_size',
          'price_score',
          'price_per_liter',
          'price_per_liter_score',
          'size',
          'url',
        )