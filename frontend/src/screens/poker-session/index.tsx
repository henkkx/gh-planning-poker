import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useMachine } from "@xstate/react";

import { FullPageProgress } from "../../components/Spinner";
import { refreshPage } from "../../utils/misc";
import { ErrorCard } from "../error/";
import Game from "./game";
import PokerMachine, { Player, PokerContextType, Task } from "./machine";
import { EventObject } from "xstate";

type PokerParams = {
  id: string;
};

type GameEvent =
  | "new_task_to_estimate"
  | "participants_changed"
  | "vote_cast"
  | "cards_revealed";

type GameMessage = {
  event: GameEvent;
  data: any;
};

const wsStates = {
  [ReadyState.CONNECTING]: "Connecting",
  [ReadyState.OPEN]: "Open",
  [ReadyState.CLOSING]: "Closing",
  [ReadyState.CLOSED]: "Closed",
  [ReadyState.UNINSTANTIATED]: "Uninstantiated",
};

const WS_PREFIX = window.location.protocol === "https:" ? "wss://" : "ws://";
const isDev = process.env.NODE_ENV === "development";
// on development react runs on port 3000 whereas django runs at 8000
const HOST = isDev ? "127.0.0.1:8000" : window.location.host;
const BASE_PATH = "/ws/poker/";
const BASE_SOCKET_URL = WS_PREFIX + HOST + BASE_PATH;
const CODE_CLOSED_UNEXPECTEDLY = 1006;
const CODE_SESSION_ENDED = 4000;

function Poker() {
  const didUnmount = React.useRef(false);
  const { id } = useParams<PokerParams>();
  const textColor = useColorModeValue("gray.600", "gray.400");
  const [closeCode, setCloseCode] = React.useState<number>();
  const [currentTask, setCurrentTask] = React.useState<Task>();
  const [players, setPlayers] = React.useState<Array<Player>>([]);

  const [gameState, send] = useMachine<PokerContextType, EventObject>(
    PokerMachine
  );

  const planningPokerUrl = BASE_SOCKET_URL + id;

  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
    useWebSocket(planningPokerUrl, {
      onClose: (e: CloseEvent) => {
        setCloseCode(e.code);
      },
      shouldReconnect: (_) => !didUnmount.current,
      reconnectAttempts: 1,
      reconnectInterval: 3000,
    });

  const currentStatus = wsStates[readyState];

  React.useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  React.useEffect(() => {
    if (!lastJsonMessage) {
      return;
    }
    const { event, data } = lastJsonMessage as GameMessage;

    switch (event) {
      case "new_task_to_estimate":
        send("NEXT_ROUND", data);
        break;
      case "participants_changed":
        setPlayers(data);
        break;
      case "vote_cast":
        break;
    }

    console.log(lastJsonMessage);
  }, [lastJsonMessage]);

  React.useEffect(() => {
    console.log(gameState.value);
  }, [gameState.value]);

  let content;

  const handleSendVote = React.useCallback(
    (value: number) => {
      sendJsonMessage({ event: "vote", data: { value } });
    },
    [sendJsonMessage]
  );

  switch (readyState) {
    case ReadyState.CONNECTING:
      content = <FullPageProgress />;
      break;
    case ReadyState.CLOSED:
      const closed = closeCode === CODE_CLOSED_UNEXPECTEDLY;
      content = closed ? (
        <ErrorCard
          canTryAgain
          onTryAgain={refreshPage}
          message={`Could not find a session with id: ${id}`}
        />
      ) : (
        <p> something went wrong </p>
      );
      break;
    default:
      content = (
        <Game
          currentTask={currentTask as Task}
          players={players}
          send={send}
          sendVote={handleSendVote}
          stage="voting"
        />
      );
  }

  return (
    <Box
      pt="4"
      pb="12"
      maxW={{ base: "xl", md: "7xl" }}
      mx="auto"
      px={{ base: "6", md: "8" }}
    >
      {content}
    </Box>
  );
}

export default Poker;
