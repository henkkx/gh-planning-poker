import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import * as React from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { EventObject } from "xstate";
import { useMachine } from "@xstate/react";

import { FullPageProgress } from "../../components/Spinner";
import { refreshPage } from "../../utils/misc";
import { ErrorCard } from "../error/";
import Game from "./game";
import PokerMachine, { Player, PokerContextType, Task } from "./machine";
import { BASE_SOCKET_URL, CODE_CLOSED_UNEXPECTEDLY } from "./constants";

type PokerParams = {
  id: string;
};

type GameEvent =
  | "new_task_to_estimate"
  | "participants_changed"
  | "vote_cast"
  | "cards_revealed"
  | "no_tasks_left";

type GameMessage = {
  event: GameEvent;
  data: any;
};

function Poker() {
  const didUnmount = React.useRef(false);

  const toast = useToast();
  const [closeCode, setCloseCode] = React.useState<number>();
  const [players, setPlayers] = React.useState<Array<Player>>([]);
  const [gameState, send] = useMachine<PokerContextType, EventObject>(
    PokerMachine
  );

  const { id } = useParams<PokerParams>();
  const planningPokerUrl = BASE_SOCKET_URL + id;

  const wsOptions = {
    onClose: (e: CloseEvent) => setCloseCode(e.code),
    shouldReconnect: (_: any) => !didUnmount.current,
    reconnectAttempts: 2,
    reconnectInterval: 2000,
  };

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    planningPokerUrl,
    wsOptions
  );

  const { currentTask } = gameState.context;

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
        setPlayers(data.participants);
        break;
      case "vote_cast":
        const { created, value } = data;
        toast({
          title: created ? "Vote cast" : "Vote updated",
          description: `Your vote (${value}) was successfully saved`,
          status: "success",
          isClosable: true,
        });
        break;
      case "cards_revealed":
        send("REVEAL", data);
        break;
      case "no_tasks_left":
        send("FINISH");
    }

    console.log(lastJsonMessage);
  }, [lastJsonMessage, send, toast]);

  const handleSendVote = React.useCallback(
    (value: number) => {
      sendJsonMessage({ event: "vote", data: { value } });
    },
    [sendJsonMessage]
  );

  const handleRevealCards = React.useCallback(
    () => sendJsonMessage({ event: "reveal_cards", data: {} }),
    [sendJsonMessage]
  );

  const handleNextRound = React.useCallback(
    () => sendJsonMessage({ event: "next_round", data: {} }),
    [sendJsonMessage]
  );
  const handleReplayRound = React.useCallback(() => send("REPLAY"), [send]);

  let content;

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
          currentTask={currentTask as any}
          players={players}
          sendVote={handleSendVote}
          revealCards={handleRevealCards}
          stage={gameState.value as any}
          votes={currentTask?.votes}
          nextRound={handleNextRound}
          replayRound={handleReplayRound}
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
