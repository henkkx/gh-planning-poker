from typing import Union
from github import Github, GithubException
from github.Repository import Repository
from github.AuthenticatedUser import AuthenticatedUser
from users import models


class RepoNotFound(Exception):
    pass


class OrgNotFound(Exception):
    pass


def build_authenticated_github_client(user: models.User) -> Github:
    token = user.access_token
    return Github(token)


def get_github_user(user: models.User) -> AuthenticatedUser:
    return build_authenticated_github_client(user).get_user()


def get_github_repo(user, repo_name: str, org_name: Union[str, None]) -> Repository:
    if org_name is not None and org_name != "":
        github = build_authenticated_github_client(user)
        try:
            repo_owner = github.get_organization(org_name)
        except GithubException:
            raise OrgNotFound
    else:
        repo_owner = get_github_user(user)
    try:
        repo = repo_owner.get_repo(repo_name)
    except GithubException:
        raise RepoNotFound
    return repo
