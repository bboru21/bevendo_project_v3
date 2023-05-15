from rest_framework import serializers

from .models import (
    ABCPrice,
)


class ABCPriceSerializer(serializers.ModelSerializer):

    class Meta:
        model = ABCPrice
        fields = (
          'current_price',
          'is_on_sale',
          'price_score',
          'price_per_liter',
          'price_per_liter_score',
          'size',
          'url',
          # TODO below fields calulated in api.utils, determine how to use here
          # 'amount_above_best_price',
          # 'price_below_average_per_liter',
          # 'price_below_average_per_size'
        )