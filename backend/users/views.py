from django.http.response import HttpResponse
from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import login


from users.github_auth import GithubAuthException, get_github_access_token, get_github_user_info
from users.services import get_or_create_user


def github_oauth_callback(request):
    query_params = request.GET
    code = query_params.get('code')
    game_url = query_params.get('state')

    baseUrl = settings.REACT_APP_BASE_URL

    try:
        if 'error' in query_params or code is None:
            raise GithubAuthException(
                "There was a problem authenticating with github"
            )
        if game_url:
            if not game_url.startswith(baseUrl):
                raise GithubAuthException(
                    "Invalid state/url"
                )
        token = get_github_access_token(code)
    except GithubAuthException as e:
        return HttpResponse(str(e), status=403)

    user_info = get_github_user_info(token)
    user, _ = get_or_create_user(access_token=token, **user_info)

    login(request, user)

    return redirect(game_url or baseUrl)
