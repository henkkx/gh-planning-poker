from django.urls import path
from poker.consumers import PlanningPokerConsumer


ws_urlpatterns = [
    path("ws/poker/<int:game_id>", PlanningPokerConsumer.as_asgi())
]
