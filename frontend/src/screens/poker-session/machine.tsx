import { createMachine } from "xstate";

type Vote = number;

export type Player = {
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
  you: Player;
  // participants: Array<Player>;
  currentTask?: Task;
};

const you: Player = {
  name: "name",
  isModerator: true,
  hasVoted: false,
};

const PokerMachine = createMachine<PokerContextType>({
  id: "poker",
  initial: "idle",
  context: {
    you,
  },
  states: {
    idle: {
      on: {
        NEXT_ROUND: "voting",
      },
    },

    voting: {
      on: {
        REVEAL: "discussing",
      },
    },

    discussing: {
      on: {
        REPLAY: "voting",
        NEXT_ROUND: "voting",
        FINISH: "finished",
      },
    },
    finished: {
      type: "final",
    },
  },
});

export default PokerMachine;
