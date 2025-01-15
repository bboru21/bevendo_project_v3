from .models import (
    Cocktail,
    CocktailIngredient,
    Favorite,
    Feast,
    Ingredient,
    Image,
    ControlledBeverage,
)
from rest_framework import serializers
from ext_data.abc_models import get_latest_price_pull_date
from ext_data.abc_serializers import ABCPriceSerializer


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
        A ModelSerializer that takes an additional `fields` argument that
        controls which fields should be displayed.

        Taken from: https://www.django-rest-framework.org/api-guide/serializers/#dynamically-modifying-fields
    """
    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the 'fields' argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class ImageSerializer(serializers.ModelSerializer):
    medium_url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['id', 'image', 'medium_url', 'alt_text', 'caption']
    
    def get_medium_url(self, obj):
        return obj.medium.url if obj.medium else None


class ControlledBeverageSerializer(serializers.ModelSerializer):

    ext_url = serializers.SerializerMethodField()
    current_prices = serializers.SerializerMethodField()

    def get_ext_url(self, obj):
        if hasattr(obj, 'abc_product'):
            return obj.abc_product.url
        return None

    def get_current_prices(self, obj):
        if hasattr(obj, 'abc_product'):
            latest_pull_date = get_latest_price_pull_date()

            qs = obj.abc_product.prices.filter(pull_date=latest_pull_date)
            qs = sorted(qs, key=lambda x: x.price_score, reverse=True)

            return ABCPriceSerializer(
                qs,
                many=True,
            ).data

        return []

    class Meta:
        model = ControlledBeverage
        fields = ['pk', 'name', 'ext_url', 'current_prices']


class IngredientSerializer(DynamicFieldsModelSerializer):

    controlled_beverages = ControlledBeverageSerializer(many=True, read_only=True)

    class Meta:
        model = Ingredient
        fields = ['pk', 'name', 'is_controlled', 'urlname', 'controlled_beverages']


class CocktailIngredientSerializer(serializers.ModelSerializer):

    ingredient = IngredientSerializer(many=False, read_only=True)
    class Meta:

        model = CocktailIngredient
        fields = ['pk', 'ingredient', 'amount', 'measurement',]


class CocktailSerializer(DynamicFieldsModelSerializer):

    ingredients = CocktailIngredientSerializer(many=True, read_only=True)
    # feasts = FeastSerializer(many=True, read_only=True) # TODO results in a NameError due to hoisting issue
    feasts = serializers.SerializerMethodField()
    images = ImageSerializer(many=True, read_only=True)

    def get_feasts(self, obj):
        return FeastSerializer(
            obj.feast_set.all(),
            many=True,

            fields=('name', 'urlname',)
        ).data

    class Meta:
        model = Cocktail
        fields = ['pk', 'name', 'ingredients', 'instructions', 'slug', 'urlname', 'feasts', 'images']

class CocktailStubSerializer(CocktailSerializer):
    image = ImageSerializer(many=False, read_only=True)

    class Meta:
        model = Cocktail
        fields = ['pk', 'name', 'urlname', 'image']


class FeastSerializer(DynamicFieldsModelSerializer):

    cocktails = CocktailStubSerializer(many=True, read_only=True)

    class Meta:
        model = Feast
        fields = ['pk', 'name', 'date', 'cocktails', 'slug', 'urlname']


class FavoriteSerializer(serializers.ModelSerializer):

    cocktail = CocktailSerializer(many=False, read_only=True, fields=('pk', 'name', 'urlname', 'images'))

    class Meta:
        model = Favorite
        fields = ['cocktail']
