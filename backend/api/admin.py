from django.contrib import admin

from .models import (
    Cocktail,
    CocktailIngredient,
    Ingredient,
    Feast,
    ControlledBeverage,
)


@admin.register(Cocktail)
class CocktailAdmin(admin.ModelAdmin):
    search_fields = (
        'name',
    )
    autocomplete_fields = (
        'ingredients',
    )
    fields = ('name', 'slug', 'ingredients', 'instructions')


@admin.register(CocktailIngredient)
class CocktailIngredientAdmin(admin.ModelAdmin):
    ordering = ('ingredient__name',)
    fields = ('ingredient', 'amount', 'measurement', 'preparation',)
    autocomplete_fields = ('ingredient',)
    search_fields = ('ingredient__name', 'amount', 'measurement', 'preparation',)


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    # form = IngredientAdminForm
    search_fields = (
        'name',
        'is_controlled',
    )
    fields = ('name', 'slug', 'is_controlled',)

@admin.register(Feast)
class FeastAdmin(admin.ModelAdmin):
    # form = FeastForm
    search_fields = (
        'name',
    )
    list_filter = ('_date',)
    ordering = ('_date',)
    fields = ('_date', 'name', 'slug', 'cocktails', 'ext_calapi_inadiutorium_season', 'ext_calapi_inadiutorium_celebration',)
    autocomplete_fields = ('cocktails', 'ext_calapi_inadiutorium_celebration',)


@admin.register(ControlledBeverage)
class ControlledBeverageAdmin(admin.ModelAdmin):
    # form = ControlledBeverageForm
    search_fields = (
        'name',
    )
    fields = ('name', 'slug', 'ingredients', 'is_in_stock')
    autocomplete_fields = ('ingredients',)
