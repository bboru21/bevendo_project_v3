from django.contrib import admin
from django.utils.html import mark_safe
from .models import (
    Cocktail,
    CocktailIngredient,
    Image,
    Ingredient,
    Feast,
    ControlledBeverage,
)
from django.contrib.contenttypes.admin import GenericTabularInline

class ImageInline(GenericTabularInline):
    model = Image
    extra = 1
    fields = ('image', 'alt_text', 'caption', 'image_preview')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" with="150" />')
        return "No image"


@admin.register(Cocktail)
class CocktailAdmin(admin.ModelAdmin):
    search_fields = (
        'name',
    )
    autocomplete_fields = (
        'ingredients',
    )
    fields = ('name', 'slug', 'ingredients', 'instructions')
    inlines = [ImageInline]


@admin.register(CocktailIngredient)
class CocktailIngredientAdmin(admin.ModelAdmin):
    ordering = ('ingredient__name',)
    fields = ('ingredient', '_amount', '_measurement', 'preparation',)
    autocomplete_fields = ('ingredient',)
    search_fields = ('ingredient__name', '_amount', '_measurement', 'preparation',)


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    # form = IngredientAdminForm
    search_fields = (
        'name',
        'is_controlled',
    )
    fields = ('name', 'slug', 'is_controlled',)
    inlines = [ImageInline]

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
    inlines = [ImageInline]


@admin.register(ControlledBeverage)
class ControlledBeverageAdmin(admin.ModelAdmin):
    # form = ControlledBeverageForm
    search_fields = (
        'name',
    )
    fields = ('name', 'slug', 'ingredients', 'is_in_stock')
    autocomplete_fields = ('ingredients',)

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'image_preview', 'alt_text', 'uploaded_at')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="150" />')
        return "No image"
