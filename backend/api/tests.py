from datetime import datetime

from django.test import TestCase

from api.models import (
    Ingredient,
    ControlledBeverage,
    Feast,
)


class IngredientTestCase(TestCase):
    def setUp(self):
        Ingredient.objects.create(
            name='Cool Cool Water',
            is_controlled=False,
        )
        Ingredient.objects.create(
            name='Red Red Wine',
            is_controlled=True,
        )

    def test_is_controlled(self):
        water = Ingredient.objects.get(name='Cool Cool Water')
        wine = Ingredient.objects.get(name='Red Red Wine')

        self.assertFalse(water.is_controlled)
        self.assertTrue(wine.is_controlled)

    def test_str(self):
        water = Ingredient.objects.get(name='Cool Cool Water')
        self.assertIsInstance(water.__str__(), str)

    def test_name_max_length(self):
        ingredient = Ingredient.objects.get(name = 'Cool Cool Water')
        max_length = ingredient._meta.get_field('name').max_length
        self.assertEqual(max_length, 250)


class ControlledBeverageTest(TestCase):

    def setUp(self):
        Ingredient.objects.create(
            name='Red Red Wine',
            is_controlled=True,
        )
        beverage = ControlledBeverage.objects.create(
            name = 'Apothic Red',
        )
        beverage.ingredients.set(Ingredient.objects.filter(pk=1))

    def test_str(self):
        beverage = ControlledBeverage.objects.get(name='Apothic Red')
        self.assertIsInstance(beverage.__str__(), str)

    def test_name_max_length(self):
        beverage = ControlledBeverage.objects.get(name='Apothic Red')
        max_length = beverage._meta.get_field('name').max_length
        self.assertEqual(max_length, 250)

    def test_is_in_stock(self):
        beverage = ControlledBeverage.objects.get(pk=1)

        self.assertFalse(beverage.is_in_stock)

        beverage.is_in_stock = True
        self.assertTrue(beverage.is_in_stock)


class FeastTest(TestCase):

    def setUp(self):
        date = datetime.strptime('2024-01-01', '%Y-%m-%d')
        Feast.objects.create(
            name='Snickers Feast',
            _date=date,
        )
        Feast.objects.create(
            name='Date-less Feast',
        )

    def test_str(self):
        feast1 = Feast.objects.get(pk=1)
        self.assertIsInstance(feast1.__str__(), str)

        feast2 = Feast.objects.get(pk=2)
        self.assertIsInstance(feast2.__str__(), str)
