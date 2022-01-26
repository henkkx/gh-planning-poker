from rest_framework import serializers

from poker.models import PlanningPokerSession, Task


class PlanningPokerSessionSerializer(serializers.ModelSerializer):
    repo_name = serializers.CharField(max_length=100)
    org_name = serializers.CharField(max_length=40, required=False)
    labels = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = PlanningPokerSession
        fields = ["id", "current_task", "repo_name", "org_name", "labels"]

    def create(self, validated_data):
        github_issues = validated_data.pop("issues")
        validated_data.pop("labels", None)

        poker_session = PlanningPokerSession.objects.create(**validated_data)

        tasks = [
            Task(
                title=issue.title,
                description=issue.body,
                github_issue_number=issue.id,
                planning_poker_session=poker_session,
            )
            for issue in github_issues
        ]

        Task.objects.bulk_create(tasks)

        current_task = poker_session.tasks.first()
        current_task.start_round()
        current_task.save()
        poker_session.current_task = current_task
        poker_session.save(update_fields=["current_task"])
        return poker_session
