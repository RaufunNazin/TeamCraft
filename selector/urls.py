from django.urls import path
from .views import register_user, login_user, add_players_to_team, get_players_by_type, get_all_players, get_user_information,  remove_players_from_team, get_players_by_search, normalize_player_data

urlpatterns = [
    path('players/', get_all_players, name='get_all_players'),
    path('players/<str:player_type>/', get_players_by_type, name='get_players_by_type'),
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    path('addplayers/<int:user_id>/', add_players_to_team, name='add_players_to_team'),
    path('user/<int:user_id>/', get_user_information, name='get_user_information'),
    path('removeplayers/<int:user_id>/<str:team_type>/', remove_players_from_team, name='remove_players_from_team'),
    path('search/<str:search_query>/', get_players_by_search, name='get_players_by_search'),
    path('normalize/', normalize_player_data, name='normalize_player_data'),
]
