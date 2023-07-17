import json

from django.contrib import admin
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.db.models import Count
from django.views.generic.detail import DetailView
from django.utils.html import format_html
from django.urls import path, reverse
from .models import ABCProduct


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
    list_display = ('name', 'pricing',)
    list_filter = ('active',)
    search_fields = (
        'name',
    )
    autocomplete_fields = (
        'controlled_beverage',
    )

    def get_urls(self):
        return [
            path(
                "<pk>/pricing",
                self.admin_site.admin_view(ABCProductPricingView.as_view()),
                name="abc_product_pricing",
            ),
            *super().get_urls(),
        ]

    def pricing(self, obj):
        url = reverse("admin:abc_product_pricing", args=(obj.pk,))
        return format_html(f'<a href="{url}">📝</a>')

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


class ABCProductPricingView(PermissionRequiredMixin, DetailView):
    permission_required = "ext_data.view_abc_product"
    template_name = "ext_data/templates/abc_product_pricing.html"
    model = ABCProduct

    def get_context_data(self, **kwargs):
        return {
            **super().get_context_data(**kwargs),
            **admin.site.each_context(self.request),
            "opts": self.model._meta,
        }

    def get(self, request, *args, **kwargs):
        res = super().get(request, *args, **kwargs)

        # price chart data
        # TODO can be cleaned up, perhaps using pandas
        product = res.context_data.get('object')
        qs = product.prices.values("current_price", "size", "pull_date").order_by("pull_date")

        pull_dates = []
        data = {}
        for item in qs:
            pull_date = item['pull_date'].strftime("%m/%d/%Y")
            if pull_date not in pull_dates:
                pull_dates.append(pull_date)

            size = item['size']
            current_price = item['current_price']
            if size in data:
                data[size].append(float(current_price))
            else:
                data[size] = [float(current_price)]

        data = [{ 'label': k, 'data': v, 'borderWidth': 3 } for k, v in data.items()]

        res.context_data.update({
            'labels': json.dumps(pull_dates),
            'datasets': json.dumps(data),
        })

        return res
