import { useToast } from "@chakra-ui/react";
import * as React from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { EventObject } from "xstate";
import { useMachine } from "@xstate/react";

import { FullPageProgress } from "../../components/Spinner";
import { refreshPage } from "../../utils/misc";
import { ErrorCard } from "../error/";
import Game from "./game";
import PokerMachine, {
  GameState,
  Player,
  PokerContextType,
  Task,
} from "./machine";
import { BASE_SOCKET_URL, CODE_SESSION_ENDED } from "./constants";
import PokerGameLayout from "./layout";
import { useSteps } from "../../components/Steps";

type PokerParams = {
  id: string;
};

type GameEvent =
  | "new_task_to_estimate"
  | "participants_changed"
  | "vote_cast"
  | "cards_revealed"
  | "no_tasks_left"
  | "task_list_received";

type GameMessage = {
  event: GameEvent;
  data: any;
  is_moderator: boolean;
};

function Poker() {
  const didUnmount = React.useRef(false);

  const toast = useToast();

  const [closeCode, setCloseCode] = React.useState<number>();
  const [players, setPlayers] = React.useState<Array<Player>>([]);
  const [isModerator, setIsModerator] = React.useState(false);
  const [tasks, setTasks] = React.useState<Array<string>>(["loading tasks..."]);
  const { nextStep, activeStep: activeTaskIdx } = useSteps({
    initialStep: 0,
  });
  const [gameState, send] = useMachine<PokerContextType, EventObject>(
    () => PokerMachine
  );

  const { id } = useParams<PokerParams>();
  const planningPokerUrl = BASE_SOCKET_URL + id;

  const [shouldConnect, setShouldConnect] = React.useState(true);

  const wsOptions = {
    onClose: (e: CloseEvent) => {
      setCloseCode(e.code);
      if (e.code == CODE_SESSION_ENDED) {
        setShouldConnect(false);
      }
    },
    shouldReconnect: (_: any) => !didUnmount.current,
    reconnectAttempts: 2,
    reconnectInterval: 2000,
  };

  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState: wsConnectionState,
  } = useWebSocket(planningPokerUrl, wsOptions, shouldConnect);

  const { currentTask } = gameState.context;
  const currentTaskTitle = currentTask?.title ?? "loading the title...";
  const currentStage = gameState.value as GameState;

  React.useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  React.useEffect(
    function handleWebsocketMessage() {
      if (!lastJsonMessage) {
        return;
      }
      const {
        event,
        data,
        is_moderator: playerShouldBeModerator,
      } = lastJsonMessage as GameMessage;

      if (!isModerator && playerShouldBeModerator) {
        setIsModerator(true);
      }

      switch (event) {
        case "new_task_to_estimate":
          send("NEXT_ROUND", data);
          break;
        case "task_list_received":
          setTasks(data.tasks);
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
    },
    [lastJsonMessage, send, isModerator]
  );

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

  const handleNextRound = React.useCallback(() => {
    sendJsonMessage({ event: "next_round", data: {} });
    nextStep();
  }, [sendJsonMessage, nextStep]);
  const handleReplayRound = React.useCallback(() => send("REPLAY"), [send]);

  let pokerGameContent;

  switch (wsConnectionState) {
    case ReadyState.UNINSTANTIATED:
    case ReadyState.CONNECTING:
    case ReadyState.CLOSING:
      pokerGameContent = <FullPageProgress />;
      break;
    case ReadyState.CLOSED:
      const sessionFinished = closeCode === CODE_SESSION_ENDED;
      pokerGameContent = sessionFinished ? (
        <ErrorCard
          message={`This session has finished`}
          errorText="No more tasks left to estimate"
        />
      ) : (
        <ErrorCard
          canTryAgain
          onTryAgain={refreshPage}
          message={`Could not find a session with id: ${id}`}
        />
      );
      break;
    case ReadyState.OPEN:
      pokerGameContent = (
        <Game
          currentTask={currentTask}
          stage={currentStage}
          sendVote={handleSendVote}
          revealCards={handleRevealCards}
          nextRound={handleNextRound}
          replayRound={handleReplayRound}
          votes={currentTask?.votes}
          isModerator={isModerator}
        />
      );
  }

  return (
    <PokerGameLayout
      title={currentTaskTitle}
      players={players}
      tasks={tasks}
      activeTaskIdx={activeTaskIdx}
    >
      {pokerGameContent}
    </PokerGameLayout>
  );
}

export default Poker;
