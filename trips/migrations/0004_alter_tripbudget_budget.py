# Generated by Django 5.1.6 on 2025-03-11 19:00

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0003_alter_triplocation_cities'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tripbudget',
            name='budget',
            field=models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0.01)]),
        ),
    ]
