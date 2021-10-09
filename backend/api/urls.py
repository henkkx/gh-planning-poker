from django.urls import path
from rest_framework import routers


from .views import SimpleAPIView

router = routers.DefaultRouter()

urlpatterns = router.urls + [
    path('test', SimpleAPIView.as_view(), name='test_api_view'),
]
