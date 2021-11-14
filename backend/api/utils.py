from github import Github
from github.AuthenticatedUser import AuthenticatedUser
from users import models


def build_authenticated_github_client(user: models.User) -> Github:
    token = user.access_token
    return Github(token)


def get_github_user(user: models.User) -> AuthenticatedUser:
    return build_authenticated_github_client(user).get_user()
