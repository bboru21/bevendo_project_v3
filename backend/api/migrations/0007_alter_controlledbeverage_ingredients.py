# Generated by Django 3.2.14 on 2023-05-12 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_favorite'),
    ]

    operations = [
        migrations.AlterField(
            model_name='controlledbeverage',
            name='ingredients',
            field=models.ManyToManyField(blank=True, default=None, related_name='controlled_beverages', to='api.Ingredient'),
        ),
    ]
