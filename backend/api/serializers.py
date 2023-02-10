from .models import (
    Cocktail,
    CocktailIngredient,
    Feast,
    Ingredient,
)
from rest_framework import serializers


class IngredientSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Ingredient
        fields = ['name',]


class CocktailIngredientSerializer(serializers.HyperlinkedModelSerializer):

    ingredient = IngredientSerializer(many=False, read_only=True)
    class Meta:

        model = CocktailIngredient
        fields = ['pk', 'ingredient', 'amount', 'measurement',]

class CocktailSerializer(serializers.HyperlinkedModelSerializer):

    ingredients = CocktailIngredientSerializer(many=True, read_only=True)

    class Meta:
        model = Cocktail
        fields = ['pk', 'name', 'ingredients', 'instructions',]


class FeastSerializer(serializers.HyperlinkedModelSerializer):

    cocktails = CocktailSerializer(many=True, read_only=True)

    class Meta:
        model = Feast
        fields = ['pk', 'name', 'date', 'cocktails',]
