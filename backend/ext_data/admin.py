from django.contrib import admin

from .models import (
    ABCProduct,
    CalapiInadiutoriumCelebration,
    LidlProduct,
    LidlProductPrice,
)

class ProductAdmin(admin.ModelAdmin):
    fields = (
        'name',
        'url',
        'avg_price_per_liter',
        'best_price_per_liter',
        'best_price_50_ml',
        'best_price_100_ml',
        'best_price_200_ml',
        'best_price_375_ml',
        'best_price_473_ml',
        'best_price_473_18_ml',
        'best_price_750_ml',
        'best_price_1_l',
        'best_price_1_5_l',
        'best_price_1_75_l',

        'avg_price_50_ml',
        'avg_price_100_ml',
        'avg_price_200_ml',
        'avg_price_375_ml',
        'avg_price_473_ml',
        'avg_price_473_18_ml',
        'avg_price_750_ml',
        'avg_price_1_l',
        'avg_price_1_5_l',
        'avg_price_1_75_l',

        'controlled_beverage',
        'active',
    )
    readonly_fields = (
        'avg_price_per_liter',
        'best_price_per_liter',
        'best_price_50_ml',
        'best_price_100_ml',
        'best_price_200_ml',
        'best_price_375_ml',
        'best_price_473_ml',
        'best_price_473_18_ml',
        'best_price_750_ml',
        'best_price_1_l',
        'best_price_1_5_l',
        'best_price_1_75_l',
        'avg_price_50_ml',
        'avg_price_100_ml',
        'avg_price_200_ml',
        'avg_price_375_ml',
        'avg_price_473_ml',
        'avg_price_473_18_ml',
        'avg_price_750_ml',
        'avg_price_1_l',
        'avg_price_1_5_l',
        'avg_price_1_75_l',
    )
    class Meta:
        abstract = True

class ABCProductAdmin(ProductAdmin):
    list_filter = ('active',)
    search_fields = (
        'name',
    )
    autocomplete_fields = (
        'controlled_beverage',
    )

admin.site.register(ABCProduct, ABCProductAdmin)

@admin.register(CalapiInadiutoriumCelebration)
class CalapiInadiutoriumCelebrationAdmin(admin.ModelAdmin):
    search_fields = (
        'title',
    )

@admin.register(LidlProduct)
class LidlProductAdmin(admin.ModelAdmin):
    pass

@admin.register(LidlProductPrice)
class LidlProductPriceAdmin(admin.ModelAdmin):
    pass
