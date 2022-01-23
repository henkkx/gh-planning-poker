import { createMachine, assign, Typestate } from "xstate";

type Vote = number;

export type Player = {
  id: number;
  name: string;
  isModerator: boolean;
  hasVoted: boolean;
  vote?: Vote;
};

export type Task = {
  title: string;
  description: string;
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
        title: "loading...",
        description: "loading...",
        votes: [],
        stats: {},
      },
    },
    states: {
      connecting: {
        on: {
          NEXT_ROUND: { target: "voting", actions: "displayTaskInfo" },
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
          FINISH_ROUND: "saving",
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
      revealVotes: assign({
        currentTask: (context, event) => {
          const { votes, stats } = event;
          const { currentTask } = context;
          return {
            ...currentTask!,
            votes,
            stats,
          };
        },
      }),
    },
  }
);

export default PokerMachine;