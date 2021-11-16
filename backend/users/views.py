from github import Github
from django.http.response import HttpResponse
from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import login
from rest_framework.views import APIView
from rest_framework.response import Response


from api.mixins import AuthRequiredMixin
from users.github_auth import GithubAuthException, get_github_access_token, get_github_user_info
from users.services import get_or_create_user


def github_oauth_callback(request):
    query_params = request.GET
    code = query_params.get('code')

    try:
        if 'error' in query_params or code is None:
            raise GithubAuthException(
                "There was a problem authenticating with github"
            )
        token = get_github_access_token(code)
    except GithubAuthException as e:
        return HttpResponse(str(e), status=401)

    user_info = get_github_user_info(token)
    user, _ = get_or_create_user(access_token=token, **user_info)

    login(request, user)

    return redirect(settings.REACT_APP_BASE_URL)
