from rest_framework import serializers
from users.models import User

from poker.models import PlanningPokerSession, Task


class PlanningPokerSessionSerializer(serializers.ModelSerializer):
    repo_name = serializers.CharField(max_length=100)
    org_name = serializers.CharField(max_length=40, required=False)

    class Meta:
        model = PlanningPokerSession
        fields = ["id", "current_task", "repo_name", "org_name"]

    def create(self, validated_data):
        github_issues = validated_data.pop("issues")

        poker_session = PlanningPokerSession.objects.create(**validated_data)

        # pull requests are considered issues by github but we only want to keep regular issues and discard PRs
        filtered_github_issues = [i for i in github_issues if i.pull_request is None]
        tasks = [
            Task(
                title=issue.title,
                description=issue.body,
                github_issue_number=issue.id,
                planningpokersession=poker_session,
                is_imported=True,
            )
            for issue in filtered_github_issues
        ]
        Task.objects.bulk_create(tasks)

        if tasks:
            poker_session.current_task = poker_session.tasks.first()
            poker_session.save(update_fields=["current_task"])
        return poker_session


class TaskSerializer(serializers.ModelSerializer):
    planningpokersession = serializers.PrimaryKeyRelatedField(
        queryset=PlanningPokerSession.objects.all(),
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "hours",
            "is_decided",
            "github_issue_number",
            "is_imported",
            "planningpokersession",
        ]


class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "votes", "poker_sessions"]
