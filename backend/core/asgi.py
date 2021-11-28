from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from django.core.asgi import get_asgi_application


# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

# os.environ['ASGI_THREADS'] = "5"


def with_router(app):
    # only import it after app is initalized so that Django Apps are loaded
    from poker.consumers import PlanningPokerConsumer

    return ProtocolTypeRouter({
        # Django's ASGI application handler to handle traditional HTTP requests
        "http": app,

        # WebSocket handler for the game itself
        "websocket": AuthMiddlewareStack(
            URLRouter([
                re_path(r"^some-route/$", PlanningPokerConsumer.as_asgi()),
            ])
        ),
    })


application = with_router(django_asgi_app)
