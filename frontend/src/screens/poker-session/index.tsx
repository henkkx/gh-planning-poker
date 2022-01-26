import { useToast } from "@chakra-ui/react";
import * as React from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { EventObject } from "xstate";
import { useMachine } from "@xstate/react";

import { FullPageProgress } from "../../components/Spinner";

import Game from "./game";
import PokerMachine, {
  GameState,
  Player,
  PokerContextType,
} from "./game/machine";
import { BASE_SOCKET_URL, CODE_SESSION_ENDED } from "./constants";
import PokerGameLayout from "./layout";
import { useSteps } from "../../components/Steps";
import PokerErrorScreen from "./error-screen";

type PokerParams = {
  id: string;
};

type GameEvent =
  | "new_task_to_estimate"
  | "participants_changed"
  | "vote_cast"
  | "cards_revealed"
  | "no_tasks_left"
  | "task_list_received"
  | "role_updated"
  | "replay_round"
  | "wait_for_next_round"
  | "start_saving";

type GameMessage = {
  event: GameEvent;
  data: any;
};

function Poker() {
  const didUnmount = React.useRef(false);

  const toast = useToast();

  const [closeCode, setCloseCode] = React.useState<number>();
  const [players, setPlayers] = React.useState<Array<Player>>([]);
  const [isModerator, setIsModerator] = React.useState(false);
  const [tasks, setTasks] = React.useState<Array<string>>(["loading tasks..."]);
  const {
    nextStep,
    activeStep: activeTaskIdx,
    setActiveStep,
  } = useSteps({
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
      if (e.code === CODE_SESSION_ENDED) {
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
      const { event, data } = lastJsonMessage as GameMessage;

      switch (event) {
        case "new_task_to_estimate":
          send("NEXT_ROUND", data);
          break;
        case "role_updated":
          setIsModerator(data.is_moderator);
          break;
        case "task_list_received":
          setTasks(data.tasks);
          setActiveStep(data.current_idx);
          break;
        case "participants_changed":
          setPlayers(data.participants);
          break;
        case "vote_cast":
          toast({
            title: "Vote cast succesfully",
            description: `${data.vote}`,
            status: "success",
            isClosable: true,
            duration: 3000,
          });
          break;
        case "cards_revealed":
          send("REVEAL_CARDS", data);
          break;
        case "replay_round":
          send("REPLAY_ROUND");
          break;
        case "wait_for_next_round":
        case "start_saving":
          send("START_SAVING", data);
          break;
        case "no_tasks_left":
          send("FINISH_SESSION");
      }

      console.log(lastJsonMessage);
    },
    [lastJsonMessage, send, setTasks, setActiveStep, setIsModerator, setPlayers]
  );

  const handleSendVote = React.useCallback(
    (value: number) => {
      sendJsonMessage({ event: "vote", data: { value } });
    },
    [sendJsonMessage]
  );

  const handleRevealCards = React.useCallback(
    () => sendJsonMessage({ event: "reveal_cards" }),
    [sendJsonMessage]
  );

  const handleFinishDiscussion = React.useCallback(() => {
    nextStep();
    sendJsonMessage({ event: "finish_discussion" });
  }, [sendJsonMessage, nextStep]);

  const handleReplayRound = React.useCallback(() => {
    sendJsonMessage({ event: "replay_round" });
  }, [sendJsonMessage]);

  const handleFinishRound = React.useCallback(
    (shouldSaveRound: boolean, note: string) => {
      sendJsonMessage({
        event: "finish_round",
        data: { should_save_round: shouldSaveRound, note },
      });
    },
    [sendJsonMessage]
  );

  let pokerGameContent;

  switch (wsConnectionState) {
    case ReadyState.UNINSTANTIATED:
    case ReadyState.CONNECTING:
    case ReadyState.CLOSING:
      pokerGameContent = <FullPageProgress />;
      break;
    case ReadyState.CLOSED:
      pokerGameContent = <PokerErrorScreen closeCode={closeCode} />;
      break;
    case ReadyState.OPEN:
      pokerGameContent = (
        <Game
          currentTask={currentTask}
          stage={currentStage}
          sendVote={handleSendVote}
          revealCards={handleRevealCards}
          finishDiscussion={handleFinishDiscussion}
          finishRound={handleFinishRound}
          replayRound={handleReplayRound}
          isModerator={isModerator}
        />
      );
  }

  return (
    <PokerGameLayout
      title={currentTask?.title}
      players={players}
      tasks={tasks}
      activeTaskIdx={activeTaskIdx}
      sessionIsInactive={wsConnectionState !== ReadyState.OPEN}
    >
      {pokerGameContent}
    </PokerGameLayout>
  );
}

export default Poker;
