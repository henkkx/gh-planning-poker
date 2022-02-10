
from typing import Dict
from github import Github
import requests
import json
from urllib.parse import parse_qs
from django.conf import settings

ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token'


class GithubAuthException(Exception):
    pass


def get_github_access_token(code: str) -> str:
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
        raise GithubAuthException('Unable to retrieve github access token')

    return token


def get_github_user_info(access_token: str) -> Dict[str, str]:
    github = Github(access_token)
    user = github.get_user()
    email_adr = user.email

    # user has not set a publicly visible email
    if email_adr is None:
        email_info = user.get_emails()[0]
        email_adr = email_info[0]

    # users are not guaranteed to have a name
    fullname = user.name or email_adr
    user_info = {
        "email": email_adr,
        "name": fullname,
        "avatar_url": user.avatar_url
    }
    return user_info
