import {
  Box,
  Button,
  Flex,
  Heading,
  ListItem,
  OrderedList,
  SimpleGrid,
  SkeletonText,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { Card } from "../../components/Card";
import { FullPageProgress } from "../../components/Spinner";
import { ErrorCard } from "../error";
import { VOTING_OPTIONS, UNSURE } from "./constants";
import { GameState, Player, Task } from "./machine";

type Props = {
  sendVote: (value: number) => void;
  stage: GameState;
  currentTask: Task;
  players: Array<Player>;
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
  players,
  replayRound,
  votes,
  nextRound,
}: Props) {
  const textColor = useColorModeValue("gray.600", "gray.400");

  const isReady = stage === "voting" || stage === "discussing";
  const isDiscussing = stage === "discussing";
  const isFinished = stage == "finished";

  if (!isReady) {
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

  const pokerButtons = VOTING_OPTIONS.map(([id, label]) => (
    <Button
      key={id}
      mt="8"
      mx="2"
      minH="6rem"
      colorScheme="green"
      size="sm"
      fontSize="3xl"
      fontWeight="bold"
      onClick={(_) => sendVote(id)}
    >
      {id < UNSURE ? id : label}
    </Button>
  ));

  return (
    <SimpleGrid>
      <Flex
        align="center"
        justifyContent="space-around"
        direction={{ md: "row", base: "column" }}
        mb="20"
      >
        <Box maxW={{ lg: "lg" }} pt="6">
          <Card>
            <Heading as="h2" size="xl" fontWeight="extrabold">
              {currentTask.title}
            </Heading>
            <Text color={textColor} mt="5" fontSize="xl">
              {currentTask.description}
            </Text>
          </Card>
        </Box>
        <Box maxW={{ lg: "lg" }} pt="6">
          <Card maxH="200" maxW={{ base: "200", lg: "300" }} overflowY="auto">
            <Heading as="h3" size="sm" mt="-4" mb="4" fontWeight="bold">
              Participants
            </Heading>
            <OrderedList>
              {isDiscussing
                ? votes.map(([_, desc]: any) => (
                    <ListItem key={desc}> {desc} </ListItem>
                  ))
                : players.map(({ id, name }) => (
                    <ListItem key={id}>{name}</ListItem>
                  ))}
            </OrderedList>
          </Card>
        </Box>
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
          <SimpleGrid columns={[5, 5, 10]}>{pokerButtons}</SimpleGrid>
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
