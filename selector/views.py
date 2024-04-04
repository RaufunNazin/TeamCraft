# your_app/views.py
from rest_framework import status
from .models import Player, User, Team, TeamPlayer, UserTeam
from .serializers import PlayerSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSerializer, TeamSerializer
from django.contrib.auth.hashers import check_password
import jwt
from django.conf import settings
from datetime import datetime, timedelta
from django.db.models import Min, Max, F

@api_view(['GET'])
def get_all_players(request):
    try:
        # Query all players
        queryset = Player.objects.all()

        # Serialize the queryset
        serializer = PlayerSerializer(queryset, many=True)

        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Player.DoesNotExist:
        return Response({"error": "No players found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_players_by_type(request, player_type):
    try:
        # Query the players by type
        queryset = Player.objects.filter(player_type=player_type)

        # Serialize the queryset
        serializer = PlayerSerializer(queryset, many=True)

        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Player.DoesNotExist:
        return Response({"error": "Players not found for the specified type"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def register_user(request):
    # Check if a user with the same username already exists
    existing_user = User.objects.filter(username=request.data.get('username')).exists()
    if existing_user:
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Create T20, ODI, and Test teams for the user upon registration
        t20_team = Team.objects.create()
        odi_team = Team.objects.create()
        test_team = Team.objects.create()

        # Link the teams to the user
        UserTeam.objects.create(user=user, team=t20_team, team_type=UserTeam.T20)
        UserTeam.objects.create(user=user, team=odi_team, team_type=UserTeam.ODI)
        UserTeam.objects.create(user=user, team=test_team, team_type=UserTeam.TEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
    if check_password(password, user.password):
        # Authentication successful
        user_serializer = UserSerializer(user)
        payload = {
            'user_id': user.pk,  # Use 'pk' instead of 'id'
            'exp': datetime.utcnow() + timedelta(days=1)  # Token expiration time
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        response_data = {
            'user': user_serializer.data,
            'token': token
        }
        return Response(response_data, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def get_user_information(request, user_id):
    try:
        # Retrieve the user object
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Serialize the user data
    user_serializer = UserSerializer(user)

    # Retrieve teams associated with the user
    user_teams = UserTeam.objects.filter(user=user)

    # Prepare data for user's teams and associated players
    user_team_data = []
    for user_team in user_teams:
        team = user_team.team

        # Retrieve all player IDs associated with the team
        team_players = TeamPlayer.objects.filter(team=team)
        player_ids = [team_player.player_id for team_player in team_players]

        # Retrieve player objects based on player IDs
        players = Player.objects.filter(pk__in=player_ids)
        player_serializer = PlayerSerializer(players, many=True)

        user_team_data.append({
            "team_type": user_team.team_type,
            "team_details": TeamSerializer(team).data,
            "players": player_serializer.data
        })

    # Prepare the response data
    response_data = {
        "user": user_serializer.data,
        "teams": user_team_data
    }

    return Response(response_data, status=status.HTTP_200_OK)

    
    
@api_view(['POST'])
def add_players_to_team(request, user_id):
    try:
        # Check if user exists
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Extract team type from request data
    team_type = request.data.get('team_type')

    if not team_type:
        return Response({"error": "Team type is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Get the user's team based on team type
    try:
        user_team = UserTeam.objects.get(user=user, team_type=team_type)
    except UserTeam.DoesNotExist:
        return Response({"error": "User does not have a team of this type"}, status=status.HTTP_400_BAD_REQUEST)

    # Extract player IDs from request data
    player_ids = request.data.get('player_ids')

    if not player_ids:
        return Response({"error": "No player IDs provided"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if all player IDs are valid
    for player_id in player_ids:
        if not Player.objects.filter(pk=player_id).exists():
            return Response({"error": f"Player with ID {player_id} not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if the players are already in the team
    existing_players = TeamPlayer.objects.filter(team=user_team.team, player__in=player_ids)
    if existing_players:
        existing_player_ids = [str(player.player_id) for player in existing_players]
        return Response({"error": f"Players with IDs {', '.join(existing_player_ids)} are already in the team"}, status=status.HTTP_400_BAD_REQUEST)

    # Add players to the team
    for player_id in player_ids:
        team_player = TeamPlayer(team=user_team.team, player_id=player_id)
        team_player.save()

    return Response({"message": "Player(s) added to team successfully"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def remove_players_from_team(request, user_id, team_type):
    try:
        # Check if user exists
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Get the user's team based on the team type
    try:
        user_team = UserTeam.objects.get(user=user, team_type=team_type)
    except UserTeam.DoesNotExist:
        return Response({"error": "User does not have a team of this type"}, status=status.HTTP_400_BAD_REQUEST)

    # Extract player IDs from the request body
    player_ids = request.data.get('player_ids', [])

    if not player_ids:
        return Response({"error": "No player IDs provided"}, status=status.HTTP_400_BAD_REQUEST)

    # Remove each player from the team
    for player_id in player_ids:
        try:
            player = Player.objects.get(pk=player_id)
        except Player.DoesNotExist:
            return Response({"error": f"Player with ID {player_id} not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the player is in the team
        try:
            team_player = TeamPlayer.objects.get(team=user_team.team, player=player)
            team_player.delete()
        except TeamPlayer.DoesNotExist:
            return Response({"error": f"Player with ID {player_id} is not in the team"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "Player(s) removed from team successfully"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_players_by_search(request, search_query):
    # Query players whose name contains the search query (case-insensitive)
    players = Player.objects.filter(player_name__icontains=search_query)

    # Serialize the queryset
    serializer = PlayerSerializer(players, many=True)

    # Return the serialized data
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['POST'])
def normalize_player_data(request):
    try:
        # Get the minimum and maximum values for each attribute
        min_max_values = Player.objects.aggregate(
            min_batting_average=Min('batting_average'),
            max_batting_average=Max('batting_average'),
            min_strike_rate=Min('strike_rate'),
            max_strike_rate=Max('strike_rate'),
            min_rotating_strike=Min('rotating_strike'),
            max_rotating_strike=Max('rotating_strike'),
            min_boundary_percentage=Min('boundary_percentage'),
            max_boundary_percentage=Max('boundary_percentage'),
            min_bowling_average=Min('bowling_average'),
            max_bowling_average=Max('bowling_average'),
            min_economy_rate=Min('economy_rate'),
            max_economy_rate=Max('economy_rate'),
            min_wickets_taken=Min('wickets_taken'),
            max_wickets_taken=Max('wickets_taken'),
            min_catches=Min('catches'),
            max_catches=Max('catches'),
            min_dismissals=Min('dismissals'),
            max_dismissals=Max('dismissals'),
            min_missed_catches=Min('missed_catches'),
            max_missed_catches=Max('missed_catches'),
        )

        # Extract the minimum and maximum values
        min_batting_average = min_max_values['min_batting_average']
        max_batting_average = min_max_values['max_batting_average']
        min_strike_rate = min_max_values['min_strike_rate']
        max_strike_rate = min_max_values['max_strike_rate']
        min_rotating_strike = min_max_values['min_rotating_strike']
        max_rotating_strike = min_max_values['max_rotating_strike']
        min_boundary_percentage = min_max_values['min_boundary_percentage']
        max_boundary_percentage = min_max_values['max_boundary_percentage']
        min_bowling_average = min_max_values['min_bowling_average']
        max_bowling_average = min_max_values['max_bowling_average']
        min_economy_rate = min_max_values['min_economy_rate']
        max_economy_rate = min_max_values['max_economy_rate']
        min_wickets_taken = min_max_values['min_wickets_taken']
        max_wickets_taken = min_max_values['max_wickets_taken']
        min_catches = min_max_values['min_catches']
        max_catches = min_max_values['max_catches']
        min_dismissals = min_max_values['min_dismissals']
        max_dismissals = min_max_values['max_dismissals']
        min_missed_catches = min_max_values['min_missed_catches']
        max_missed_catches = min_max_values['max_missed_catches']

        # Normalize each attribute and update the database
        Player.objects.update(
            batting_average_normalized=(F('batting_average') - min_batting_average) / (max_batting_average - min_batting_average),
            strike_rate_normalized=(F('strike_rate') - min_strike_rate) / (max_strike_rate - min_strike_rate),
            rotating_strike_normalized=(F('rotating_strike') - min_rotating_strike) / (max_rotating_strike - min_rotating_strike),
            boundary_percentage_normalized=(F('boundary_percentage') - min_boundary_percentage) / (max_boundary_percentage - min_boundary_percentage),
            bowling_average_normalized=(F('bowling_average') - min_bowling_average) / (max_bowling_average - min_bowling_average),
            economy_rate_normalized=(F('economy_rate') - min_economy_rate) / (max_economy_rate - min_economy_rate),
            wickets_taken_normalized=(F('wickets_taken') - min_wickets_taken) / (max_wickets_taken - min_wickets_taken),
            catches_normalized=(F('catches') - min_catches) / (max_catches - min_catches),
            dismissals_normalized=(F('dismissals') - min_dismissals) / (max_dismissals - min_dismissals),
            missed_catches_normalized=(F('missed_catches') - min_missed_catches) / (max_missed_catches - min_missed_catches),
        )

        return Response({"message": "Player data normalized successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


