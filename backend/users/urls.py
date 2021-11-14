from django.urls import path

from .views import github_oauth_callback, user_info_view

urlpatterns = [
    path('me', user_info_view, name='user_info_view'),
    path('github-callback/', github_oauth_callback, name='gh_callback')
]
