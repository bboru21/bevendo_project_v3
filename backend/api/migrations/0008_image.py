# Generated by Django 3.2.14 on 2024-12-26 17:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('api', '0007_alter_controlledbeverage_ingredients'),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='images/')),
                ('alt_text', models.CharField(blank=True, max_length=255)),
                ('caption', models.CharField(blank=True, max_length=255)),
                ('object_id', models.PositiveIntegerField()),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
            options={
                'db_table': 'api_image',
                'ordering': ['-uploaded_at'],
            },
        ),
    ]
