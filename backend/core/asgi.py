import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

# os.environ['ASGI_THREADS'] = "5"


def get_poker_urlpatterns():
    import poker.routing
    return poker.routing.ws_urlpatterns


application = ProtocolTypeRouter({
    # Django's ASGI application handler to handle traditional HTTP requests
    "http": django_asgi_app,

    # WebSocket handler for the game itself
    "websocket": AuthMiddlewareStack(
        URLRouter(
            get_poker_urlpatterns()
        )
    )

})
