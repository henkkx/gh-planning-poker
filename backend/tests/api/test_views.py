import pytest

from tests.utils import AnyInt, AnyStr
from poker.models import PlanningPokerSession
from .github_mocks import MockGithub


class TestUserViews:
    def test_get_user_info(self, api_client, user):
        response = api_client.get("/api/users/me")

        assert response.status_code == 403

        api_client.force_login(user=user)
        response = api_client.get("/api/users/me")

        assert response.data == {
            "avatarUrl": None,
            "name": user.name,
            "email": user.email,
            "isAuthenticated": True,
        }

    def test_get_csrf(self, api_client):
        response = api_client.get("/api/csrf")
        assert response.data == {"detail": "CSRF cookie set"}


class TestPokerSessionViews:
    @pytest.mark.parametrize("is_org_repo", [True, False])
    def test_create_poker_session(self, is_org_repo, monkeypatch, api_client, user):

        REPO_NAME = "test_repo"
        ORG_NAME = "kaiba corp"

        monkeypatch.setattr("api.github_utils.Github", MockGithub)
        api_client.force_login(user=user)
        data = {"repo_name": REPO_NAME}

        if is_org_repo:
            data["org_name"] = ORG_NAME

        response = api_client.post("/api/poker", data, format="json")
        assert response.status_code == 201
        assert response.data == {
            "id": AnyStr(),
            "current_task": AnyInt(),
            "repo_name": REPO_NAME,
            "org_name": ORG_NAME if is_org_repo else None,
        }

        sessions = PlanningPokerSession.objects.all()

        assert len(sessions) == 1
        assert sessions.filter(repo_name=REPO_NAME).exists()
