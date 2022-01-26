import { createMachine, assign, Typestate } from "xstate";

const updateCurrentTask: any = assign({
  currentTask: (_, event) => event,
});

type Vote = number;

export type Player = {
  id: number;
  name: string;
  isModerator: boolean;
  hasVoted: boolean;
  vote?: Vote;
};

export type Task = {
  title?: string;
  description?: string;
  votes: Array<string>;
  stats: Record<string, string>;
};

export type PokerContextType = {
  currentTask: Task;
};

export type GameState =
  | "connecting"
  | "voting"
  | "discussing"
  | "saving"
  | "finished";

const PokerMachine = createMachine<
  PokerContextType,
  any,
  Typestate<PokerContextType>
>(
  {
    id: "poker_machine",
    initial: "connecting",
    context: {
      currentTask: {
        votes: [],
        stats: {},
      },
    },
    states: {
      connecting: {
        on: {
          NEXT_ROUND: { target: "voting", actions: "displayTaskInfo" },
          REVEAL_CARDS: { target: "discussing", actions: "revealVotes" },
          START_SAVING: { target: "saving", actions: "updateCurrentTask" },
        },
      },

      voting: {
        on: {
          REVEAL_CARDS: { target: "discussing", actions: "revealVotes" },
        },
      },

      discussing: {
        on: {
          REPLAY_ROUND: "voting",
          START_SAVING: "saving",
          NEXT_ROUND: { target: "voting", actions: "displayTaskInfo" },
        },
      },

      saving: {
        on: {
          NEXT_ROUND: { target: "voting", actions: "displayTaskInfo" },
          FINISH_SESSION: "finished",
        },
      },

      finished: {
        type: "final",
      },
    },
  },
  {
    actions: {
      displayTaskInfo: assign({
        currentTask: (context, event) => {
          const { currentTask } = context;

          const { title, description } = event;
          return {
            ...currentTask,
            title,
            description,
          };
        },
      }),
      revealVotes: updateCurrentTask,
      updateCurrentTask,
    },
  }
);

export default PokerMachine;
