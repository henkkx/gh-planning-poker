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
import { FullPageProgress } from "../../components/Spinner";
import { NotFoundCard } from "../not-found/not-found-card";
import Game from "./game";

type PokerParams = {
  id: string;
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
// on development react runs on port 3000 whereas django at 8000
const HOST = isDev ? "127.0.0.1:8000" : window.location.host;

function Poker(props: any) {
  const { id } = useParams<PokerParams>();
  const textColor = useColorModeValue("gray.600", "gray.400");
  const [closeCode, setCloseCode] = React.useState<number | null>(null);
  const pokerGamePath = `/ws/poker/${id}`;
  const socketUrl = WS_PREFIX + HOST + pokerGamePath;

  console.log(socketUrl);

  const didUnmount = React.useRef(false);

  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
    useWebSocket(socketUrl, {
      onClose: (e: CloseEvent) => {
        setCloseCode(e.code);
      },
      // shouldReconnect: (_) => !didUnmount.current,
      // reconnectAttempts: 1,
      // reconnectInterval: 3000,
    });

  const currentStatus = wsStates[readyState];

  React.useEffect(() => {
    console.log(currentStatus);

    return () => {
      didUnmount.current = true;
    };
  }, [readyState]);

  let content;

  const handleSendVote = React.useCallback((vote: number) => {
    sendJsonMessage({ event: "vote", data: vote });
  }, []);

  switch (readyState) {
    case ReadyState.CONNECTING:
      content = <FullPageProgress />;
      break;
    case ReadyState.CLOSED:
      content =
        closeCode === 1006 ? (
          <NotFoundCard message={`Could not find a session with id: ${id}`} />
        ) : (
          <p> something went wrong </p>
        );
      break;
    default:
      content = <Game sendVote={handleSendVote} />;
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
