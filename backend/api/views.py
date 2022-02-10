from .mixins import AuthRequiredMixin, PublicApiMixin
from .serializers import PlanningPokerSessionSerializer
from .github_utils import IssuesNotFound, OrgNotFound, RepoNotFound, get_github_repo, get_issues_from_repo
from poker.models import PlanningPokerSession
from django.middleware import csrf
from django.contrib.auth import logout
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from users.github_auth import get_github_user_info
from users.services import get_or_create_user


class CSRF(PublicApiMixin, APIView):
    def get(self, request):
        csrf_token = csrf.get_token(request)
        return Response(
            {"detail": "CSRF cookie set"}, headers={"X-CSRFToken": csrf_token}
        )


get_csrf = CSRF.as_view()


class UserInfo(AuthRequiredMixin, APIView):

    def get(self, request):
        user = request.user
        token = user.access_token
        user_info = get_github_user_info(token)
        user, _ = get_or_create_user(access_token=token, **user_info)

        return Response({
            "name": user.name,
            "email": user.email,
            "isAuthenticated": True,
            "avatarUrl": user.avatar_url,
        })


user_info_view = UserInfo.as_view()


class Logout(AuthRequiredMixin, APIView):
    def post(self, request):
        logout(request)
        return Response({"ok": True})


logout_view = Logout.as_view()


class MostRecentSession(AuthRequiredMixin, APIView):
    def get(self, request):
        recent = request.user.most_recent_session
        return Response({"mostRecentSession": recent.get_joining_details() if recent else None})


most_recent_session_view = MostRecentSession.as_view()


class PlanningPokerSessionView(AuthRequiredMixin, CreateAPIView):
    queryset = PlanningPokerSession.objects.all()
    serializer_class = PlanningPokerSessionSerializer
    filterset_fields = ["id", "current_task", "tasks"]

    def perform_create(self, serializer):
        user = self.request.user

        post_data = self.request.data
        repo_name = post_data.get("repo_name")
        org_name = post_data.get("org_name")
        labels_string = post_data.get("labels")
        labels = labels_string.split(',') if labels_string else []

        try:
            repo = get_github_repo(user, repo_name, org_name)
            issues = get_issues_from_repo(repo, labels)
        except OrgNotFound:
            raise exceptions.ParseError(
                f"No organization with the name {org_name} was found in your Github Account",
                code=400,
            )
        except RepoNotFound:
            raise exceptions.ParseError(
                f"No repository with the name {repo_name} was found in your {org_name if org_name else user.name}'s Github Account",
                code=400,
            )
        except IssuesNotFound:
            raise exceptions.NotFound(
                f"No issues were found matching the labels: {labels}",
                code=404,
            )

        fields = {
            "repo_name": repo_name,
            "org_name": org_name,
            "moderator": user,
            "issues": issues,
        }

        serializer.save(**fields)


planning_poker_session_view = PlanningPokerSessionView.as_view()
