const WS_PREFIX = window.location.protocol === "https:" ? "wss://" : "ws://";
const isDev = process.env.NODE_ENV === "development";
// on development react runs on port 3000 whereas django runs at 8000
const HOST = isDev ? "127.0.0.1:8000" : window.location.host;
const BASE_PATH = "/ws/poker/";
export const BASE_SOCKET_URL = WS_PREFIX + HOST + BASE_PATH;
export const CODE_CLOSED_UNEXPECTEDLY = 1006;
export const CODE_SESSION_ENDED = 4000;

type VotingOptions = Array<[number, string]>;

export const UNSURE = 99;
export const NOT_DOABLE = 100;

export const VOTING_OPTIONS: VotingOptions = [
  [1, "1"],
  [2, "2"],
  [3, "3"],
  [5, "5"],
  [8, "8"],
  [13, "13"],
  [20, "20"],
  [40, "40"],
  [UNSURE, "?"],
  [NOT_DOABLE, "∞"],
];
