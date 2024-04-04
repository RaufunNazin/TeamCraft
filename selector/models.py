from django.db import models

class Player(models.Model):
    player_id = models.AutoField(primary_key=True)
    player_name = models.CharField(max_length=100)
    player_photo = models.CharField(max_length=200)
    player_type = models.CharField(max_length=20)
    batting_average = models.FloatField()
    strike_rate = models.FloatField()
    rotating_strike = models.IntegerField()
    boundary_percentage = models.FloatField()
    bowling_average = models.FloatField()
    economy_rate = models.FloatField()
    wickets_taken = models.IntegerField()
    catches = models.IntegerField()
    dismissals = models.IntegerField()
    missed_catches = models.IntegerField()
    batting_average_normalized = models.FloatField(default=0.0)
    strike_rate_normalized = models.FloatField(default=0.0)
    rotating_strike_normalized = models.FloatField(default=0.0)
    boundary_percentage_normalized = models.FloatField(default=0.0)
    bowling_average_normalized = models.FloatField(default=0.0)
    economy_rate_normalized = models.FloatField(default=0.0)
    wickets_taken_normalized = models.FloatField(default=0.0)
    catches_normalized = models.FloatField(default=0.0)
    dismissals_normalized = models.FloatField(default=0.0)
    missed_catches_normalized = models.FloatField(default=0.0)

class Team(models.Model):
    team_id = models.AutoField(primary_key=True)

class TeamPlayer(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

class UserTeam(models.Model):
    T20 = 'T20'
    ODI = 'ODI'
    TEST = 'TEST'
    TEAM_TYPES = [
        (T20, 'T20'),
        (ODI, 'ODI'),
        (TEST, 'Test'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    team_type = models.CharField(max_length=4, choices=TEAM_TYPES)
