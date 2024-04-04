# your_app/serializers.py
from rest_framework import serializers
from .models import Player, User, Team
from django.contrib.auth.hashers import make_password

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)
    
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['team_id']