# Generated by Django 5.2.1 on 2025-07-10 06:35

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0002_certificate'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CollectorUsers',
            fields=[
                ('pk_collector_user', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('phone_number', models.CharField(blank=True, max_length=15, null=True)),
                ('fk_management', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collectors', to='management.management')),
                ('fk_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collector_users', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
