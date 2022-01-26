
CODE_SESSION_ENDED = 4000
NOT_ESTIMATED = None
NOT_DOABLE = 100
UNSURE = 99
HOURS_TO_COMPLETE_CHOICES = (
    (NOT_ESTIMATED, "not estimated"),
    (1, "1 hour"),
    (2, "2 hours"),
    (3, "3 hours"),
    (5, "5 hours"),
    (8, "8 hours"),
    (13, "13 hours"),
    (20, "20 hours"),
    (40, "40 hours"),
    (NOT_DOABLE, "the task is too large or complex, we need to reconsider it"),
    (UNSURE, "I'm unsure, we might need to clarify the requirements"),
)


class TaskState:
    """States that a Task model can be in during a Round in Planning Poker"""

    NOT_STARTED = "NOT_STARTED"    # not started yet
    VOTING = "VOTING"              # users are sending in votes
    DISCUSSING = "DISCUSSING"      # votes have been revealed and users are discussing
    SAVING = "SAVING"          # moderator is adding notes and sacing the round
    FINISHED = "FINISHED"        # the round has finished

    CHOICES = (
        (NOT_STARTED, NOT_STARTED),
        (VOTING, VOTING),
        (DISCUSSING, DISCUSSING),
        (SAVING, SAVING),
        (FINISHED, FINISHED)
    )


class GameEvent:
    VOTE = "vote"
    VOTE_CAST = "vote_cast"
    REVEAL_CARDS = "reveal_cards"
    CARDS_REVEALED = "cards_revealed"
    FINISH_DISCUSSION = "finish_discussion"
    START_SAVING = "start_saving"
    FINISH_ROUND = "finish_round"
    REPLAY_ROUND = "replay_round"
    PARTICIPANTS_CHANGED = "participants_changed"
    ROLE_UPDATED = "role_updated"
    NEW_TASK_TO_ESTIMATE = "new_task_to_estimate"
    TASK_LIST_RECEIVED = "task_list_received"
    WAIT_FOR_NEXT_ROUND = "wait_for_next_round"
