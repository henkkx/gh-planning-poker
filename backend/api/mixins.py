from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication


class AuthRequiredMixin:
    authentication_classes = (SessionAuthentication, )
    permission_classes = (IsAuthenticated, )


class PublicApiMixin:
    authentication_classes = ()
    permission_classes = ()
