from github import Github
from django.http.response import HttpResponse, JsonResponse
import requests
import json
from django.shortcuts import redirect, render
from django.shortcuts import redirect
from django.urls import reverse
from rest_framework.decorators import api_view
from urllib.parse import parse_qs
from django.conf import settings


def init_auth_flow(request):

    pass


def get_github_access_token(code):
    pass


ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token'


def github_callback(request):
    code = request.GET.get('code', '')

    auth_response = requests.post(
        ACCESS_TOKEN_URL,
        data=json.dumps({
            'code': code,
            'client_id': settings.CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET
        }),
        headers={'content-type': 'application/json'}
    )

    parsed = parse_qs(auth_response.text)
    try:
        token = parsed.get('access_token')[0]
    except:
        return HttpResponse(status_code=401)

    request.session['access_token'] = token

    return redirect(settings.REACT_APP_BASE_URL)


def github_test(request):
    token = request.session['access_token']
    g = Github(token)
    # r = g.get_user().get_emails()[0][0]
    r = g.get_user().name
    return JsonResponse({'test': r})
