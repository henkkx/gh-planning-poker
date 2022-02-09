from django.urls import path

from .views import planning_poker_session_view, get_csrf, user_info_view, most_recent_session_view


urlpatterns = [

    path('users/me', user_info_view, name='user_info_view'),
    path('recent', most_recent_session_view, name='most_recent_session_view'),
    path('poker', planning_poker_session_view,
         name='planning_poker_sessions'),
    path('csrf', get_csrf, name='get_csrf_token')
]
