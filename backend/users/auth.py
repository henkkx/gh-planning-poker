from django.contrib.auth.backends import BaseBackend


class GithubAuthBackend(BaseBackend):
    def authenticate(request):
        pass
