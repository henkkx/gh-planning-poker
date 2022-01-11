import {
  Box,
  Button,
  Flex,
  Heading,
  ListItem,
  OrderedList,
  Select,
  SimpleGrid,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card } from "../../components/Card";
import { FullPageProgress } from "../../components/Spinner";
import { ErrorCard } from "../error";
import { VOTING_OPTIONS, UNSURE } from "./constants";
import { GameState, Player, Task } from "./machine";

type Props = {
  sendVote: (value: number) => void;
  stage: GameState;
  currentTask?: Task;
  replayRound: any;
  revealCards: any;
  votes: any;
  nextRound: any;
};

function Game({
  sendVote,
  stage,
  currentTask,
  revealCards,
  replayRound,
  votes,
  nextRound,
}: Props) {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [selectedValue, setSelectedValue] = React.useState<any>();

  const isConnecting = stage === "connecting";
  const isDiscussing = stage === "discussing";
  const isFinished = stage == "finished";

  if (isConnecting) {
    return <FullPageProgress />;
  }

  if (isFinished) {
    return (
      <ErrorCard
        message="Game finished!"
        errorText="No more tasks left to estimate"
      />
    );
  }

  const taskDescriptionMarkdown =
    currentTask?.description ?? "no description provided.";

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedValue(e.target.value);

  const pokerButtons = isMobile ? (
    <>
      <Select size="lg" onChange={handleSelectionChange}>
        {VOTING_OPTIONS.map(([id, label]) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </Select>
      <Button
        mt="2"
        colorScheme="blue"
        onClick={(_) => sendVote(selectedValue)}
      >
        Send Vote
      </Button>
    </>
  ) : (
    VOTING_OPTIONS.map(([id, label]) => (
      <Button
        key={id}
        mt="20"
        mx="2"
        minH="6rem"
        colorScheme="green"
        fontSize="3xl"
        fontWeight="bold"
        onClick={(_) => sendVote(id)}
      >
        {id < UNSURE ? id : label}
      </Button>
    ))
  );

  return (
    <SimpleGrid>
      <Flex
        align="center"
        justifyContent="space-around"
        direction={{ md: "row", base: "column" }}
      >
        <Box maxW="90%">
          <Card bg={bgColor} overflowY="auto" maxH="sm">
            <Heading as="h4" mt="0" mb="4" size="md">
              Description
            </Heading>
            <ReactMarkdown
              children={taskDescriptionMarkdown}
              remarkPlugins={[remarkGfm]}
            ></ReactMarkdown>
          </Card>
        </Box>
        {isDiscussing ? (
          <Box maxW={{ lg: "lg" }} pt="6">
            <Card maxH="200" maxW={{ base: "200", lg: "300" }} overflowY="auto">
              <Heading as="h3" size="sm" mt="-4" mb="4" fontWeight="bold">
                Votes
              </Heading>
              <OrderedList>
                {votes.map(([_, desc]: any) => (
                  <ListItem key={desc}> {desc} </ListItem>
                ))}
              </OrderedList>
            </Card>
          </Box>
        ) : null}
      </Flex>

      {isDiscussing ? (
        <SimpleGrid columns={[2, 2, 1]}>
          <Button
            mt="8"
            w="60%"
            justifySelf="center"
            colorScheme="blue"
            onClick={replayRound}
          >
            Replay round
          </Button>
          <Button
            mt="8"
            w="60%"
            justifySelf="center"
            colorScheme="blue"
            onClick={nextRound}
          >
            Next round
          </Button>
        </SimpleGrid>
      ) : (
        <>
          <SimpleGrid columns={[1, 5, 5, 10]}>{pokerButtons}</SimpleGrid>
          <Button
            mt="8"
            w="60%"
            justifySelf="center"
            colorScheme="blue"
            onClick={revealCards}
          >
            Reveal cards
          </Button>
        </>
      )}
    </SimpleGrid>
  );
}

export default Game;
