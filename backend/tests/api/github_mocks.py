class MockIssue:

    def __init__(self, *, number, title='title', body='body', pull_request=None):
        self.pull_request = pull_request
        self.number = number
        self.title = title
        self.body = body
        self.pull_request = pull_request


class MockRepo:
    def get_issues(self, state='open', labels=[]):
        return [
            MockIssue(number=1, title='pr', pull_request=True),
            MockIssue(number=2)
        ]


class MockGithubUser:

    def get_repo(self, user):
        return MockRepo()


class MockGithub:
    def __init__(self, _):
        pass

    def get_user(self):
        return MockGithubUser()

    def get_organization(self, _):
        return MockGithubUser()
