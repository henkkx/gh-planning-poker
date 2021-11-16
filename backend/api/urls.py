from django.urls import path
from rest_framework import routers


from .views import PlanningPokerSessionViewSet, get_csrf, user_info_view

router = routers.DefaultRouter()

router.register(r'poker-sessions',
                PlanningPokerSessionViewSet, 'planningPokerSession')

urlpatterns = router.urls + [
    path('users/me', user_info_view, name='user_info_view'),
    path('csrf', get_csrf, name='get_csrf_token')
]
