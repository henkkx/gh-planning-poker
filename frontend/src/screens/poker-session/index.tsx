import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";

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

  const pokerGamePath = `/ws/poker/${id}`;
  const socketUrl = WS_PREFIX + HOST + pokerGamePath;

  console.log(socketUrl);

  const didUnmount = React.useRef(false);

  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
    useWebSocket(socketUrl, {
      onOpen: () => alert("opened"),
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

  return (
    <Box
      pt="24"
      pb="12"
      maxW={{ base: "xl", md: "7xl" }}
      mx="auto"
      px={{ base: "6", md: "8" }}
    >
      <Flex
        align="flex-start"
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        mb="20"
      >
        <Box flex="1" maxW={{ lg: "xl" }} pt="6">
          <Heading as="h1" size="3xl" mt="8" fontWeight="extrabold">
            Online Planning Poker with Github Integration
          </Heading>
          <Text color={mode("gray.600", "gray.400")} mt="5" fontSize="xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua
            adipiscing elit.
          </Text>

          <Button
            mt="8"
            minW="14rem"
            colorScheme="blue"
            size="lg"
            height="14"
            px="8"
            fontSize="md"
            fontWeight="bold"
          >
            do smth
          </Button>
        </Box>
        <Box boxSize={{ base: "20", lg: "8" }} />
      </Flex>
      <Box>
        <Text color={mode("gray.600", "gray.400")} mt="5" fontSize="sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua adipiscing
          elit.
        </Text>
      </Box>
    </Box>
  );
}

export default Poker;
