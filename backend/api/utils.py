from typing import Union, List
from github import Github
from github.Repository import Repository
from github.AuthenticatedUser import AuthenticatedUser
from github.Issue import Issue
from users import models


def build_authenticated_github_client(user: models.User) -> Github:
    token = user.access_token
    return Github(token)


def get_github_user(user: models.User) -> AuthenticatedUser:
    return build_authenticated_github_client(user).get_user()


def get_github_repo(user, repo_name: str, org_name: Union[str, None]) -> Repository:
    if org_name is not None and org_name != "":
        github = build_authenticated_github_client(user)
        repo_owner = github.get_organization(org_name)
    else:
        repo_owner = get_github_user(user)
    repo = repo_owner.get_repo(repo_name)
    return repo
