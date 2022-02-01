from typing import List, Union
from github import Github, GithubException
from github.Repository import Repository
from github.AuthenticatedUser import AuthenticatedUser
from users import models


class RepoNotFound(Exception):
    pass


class OrgNotFound(Exception):
    pass


class IssuesNotFound(Exception):
    pass


def build_authenticated_github_client(user: models.User) -> Github:
    token = user.access_token
    return Github(token)


def get_github_user(user: models.User) -> AuthenticatedUser:
    return build_authenticated_github_client(user).get_user()


def get_github_repo(user, repo_name: str, org_name: Union[str, None] = None) -> Repository:
    if org_name:
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


def get_issues_from_repo(repo: Repository, labels: List[str]):
    pr_and_regular_issues = repo.get_issues(state="open", labels=labels)
    # pull requests are considered issues by github but we only want to keep regular issues and discard PRs
    regular_issues = [
        i for i in pr_and_regular_issues if i.pull_request is None
    ]

    if not regular_issues:
        raise IssuesNotFound

    return regular_issues
