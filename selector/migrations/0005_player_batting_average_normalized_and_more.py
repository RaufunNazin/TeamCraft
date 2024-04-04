# Generated by Django 5.0.2 on 2024-04-03 10:55

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("selector", "0004_remove_team_team_name"),
    ]

    operations = [
        migrations.AddField(
            model_name="player",
            name="batting_average_normalized",
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name="player",
            name="boundary_percentage_normalized",
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name="player",
            name="bowling_average_normalized",
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name="player",
            name="catches_normalized",
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name="player",
            name="dismissals_normalized",
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name="player",
            name="economy_rate_normalized",
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name="player",
            name="missed_catches_normalized",
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name="player",
            name="rotating_strike_normalized",
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name="player",
            name="strike_rate_normalized",
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name="player",
            name="wickets_taken_normalized",
            field=models.FloatField(default=0.0),
        ),
    ]