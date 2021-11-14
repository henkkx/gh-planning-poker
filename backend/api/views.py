from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.utils import get_github_user

from .mixins import AuthRequiredMixin


class SimpleAPIView(APIView):
    def get(self, request):
        text = request.query_params.get('text', '')
        return Response({"text": text.upper()}, status=status.HTTP_200_OK)


class ChooseRepo(AuthRequiredMixin, APIView):
    def get(self, request, repo):

        user = get_github_user(request.user)
        return Response(repo.name for repo in user.get_repos())


choose_repo_view = ChooseRepo.as_view()


class Orgs(AuthRequiredMixin, APIView):
    def get(self, request):
        pass
