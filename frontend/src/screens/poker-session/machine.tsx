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
  votes?: Array<string>;
};

export type PokerContextType = {
  you?: Player;
  currentTask?: Task;
};

export type GameState = "connecting" | "voting" | "discussing" | "finished";

const PokerMachine = createMachine<
  PokerContextType,
  any,
  Typestate<PokerContextType>
>(
  {
    id: "poker_machine",
    initial: "connecting",
    context: {},
    states: {
      connecting: {
        on: {
          NEXT_ROUND: { target: "voting", actions: "displayTaskInfo" },
        },
      },

      voting: {
        on: {
          REVEAL: { target: "discussing", actions: "revealVotes" },
        },
      },

      discussing: {
        on: {
          REPLAY: "voting",
          NEXT_ROUND: { target: "voting", actions: "displayTaskInfo" },
          FINISH: "finished",
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
        currentTask: (_, event) => {
          const { title, description } = event;
          return {
            title,
            description,
          };
        },
      }),
      revealVotes: assign({
        currentTask: (context, event) => {
          const { votes } = event;
          const { currentTask } = context;
          return {
            ...currentTask!,
            votes,
          };
        },
      }),
    },
  }
);

export default PokerMachine;
