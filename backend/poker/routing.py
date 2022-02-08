from django.urls import re_path
from poker.consumers import PlanningPokerConsumer


ws_urlpatterns = [
    re_path(r"ws/poker/(?P<game_id>[^/]+)$", PlanningPokerConsumer.as_asgi())
]
