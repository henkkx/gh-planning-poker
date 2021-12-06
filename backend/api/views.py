from django.middleware import csrf
from rest_framework import filters, mixins, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, ListAPIView
from .utils import get_github_repo, get_github_user

from poker.models import PlanningPokerSession
from users.models import User
from .serializers import PlanningPokerSessionSerializer, UserSearchSerializer
from .mixins import AuthRequiredMixin, PublicApiMixin


class CSRF(PublicApiMixin, APIView):
    def get(self, request):
        csrf_token = csrf.get_token(request)
        return Response({'detail': 'CSRF cookie set'}, headers={'X-CSRFToken': csrf_token})


get_csrf = CSRF.as_view()


class UserInfo(AuthRequiredMixin, APIView):

    def get(self, request):
        user = request.user

        return Response({
            'name': user.name,
            'email': user.email,
            'isAuthenticated': True
        })


user_info_view = UserInfo.as_view()


class ChooseRepo(AuthRequiredMixin, APIView):
    def get(self, request):
        params = request.GET
        repo = params.get('repo')
        org = params.get('org')
        if org is None:
            pass
        user = get_github_user(request.user)

        return Response(repo.name for repo in user.get_repos())


choose_repo_view = ChooseRepo.as_view()


class Orgs(AuthRequiredMixin, APIView):
    def get(self, request):
        pass


class PlanningPokerSessionView(AuthRequiredMixin, CreateAPIView):
    queryset = PlanningPokerSession.objects.all()
    serializer_class = PlanningPokerSessionSerializer
    filterset_fields = ['id', 'current_task', 'tasks']

    def perform_create(self, serializer):
        user = self.request.user

        post_data = self.request.data
        repo_name = post_data.get('repo_name')
        org_name = post_data.get('org_name')

        repo = get_github_repo(user, repo_name, org_name)
        issues = repo.get_issues(state='open')

        fields = {
            "repo_name": repo_name,
            "org_name": org_name,
            "moderator": user,
            "issues": issues,
        }

        serializer.save(**fields)


planning_poker_session_view = PlanningPokerSessionView.as_view()


class UserSearchView(AuthRequiredMixin, ListAPIView):
    queryset = User.objects.filter(is_active=True).all()
    serializer_class = UserSearchSerializer
    filter_backends = [filters.SearchFilter, ]
    search_fields = ["email"]

    def get(self, request, *args, **kwargs):
        params = request.query_params
        poker_session_id = params.get("poker_session", "")
        search = params.get("search", "")
        if not poker_session_id.isdigit() or not PlanningPokerSession.objects.filter(id=poker_session_id).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if len(search) < 3:
            return Response([])

        return super().get(request, *args, **kwargs)
