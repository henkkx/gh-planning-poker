import {
  Button,
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
import { GameState, Task } from "./machine";

type Props = {
  sendVote: (value: number) => void;
  stage: GameState;
  currentTask?: Task;
  replayRound: any;
  revealCards: any;
  votes: any;
  nextRound: any;
  isModerator: boolean;
};

function Game({
  sendVote,
  stage,
  currentTask,
  revealCards,
  replayRound,
  votes,
  nextRound,
  isModerator,
}: Props) {
  const bgColor = useColorModeValue("gray.50", "gray.600");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedValue, setSelectedValue] = React.useState<number>(1);

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
    setSelectedValue(parseInt(e.target.value));

  const pokerButtons = isMobile ? (
    <SimpleGrid m={2} maxW={"100%"} columns={[1, 2, 2]}>
      <Select size="lg" onChange={handleSelectionChange}>
        {VOTING_OPTIONS.map(([id, label]) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </Select>
      <Button
        mt="2"
        mx={[1, 2, 2]}
        colorScheme="blue"
        onClick={(_) => sendVote(selectedValue)}
      >
        Send Vote
      </Button>
    </SimpleGrid>
  ) : (
    <SimpleGrid columns={[1, 5, 5, 10]}>
      {VOTING_OPTIONS.map(([id, label]) => (
        <Button
          key={id}
          mx="2"
          minH="6rem"
          colorScheme="green"
          fontSize="3xl"
          fontWeight="bold"
          onClick={(_) => sendVote(id)}
        >
          {id < UNSURE ? id : label}
        </Button>
      ))}
    </SimpleGrid>
  );

  return (
    <SimpleGrid>
      <SimpleGrid columns={1} px={["1%", "2%", "5%", "10%"]}>
        {isDiscussing ? (
          <Card bg={bgColor} mt="2" overflowY="auto">
            <Heading as="h3" size="sm" mt="-4" mb="4" fontWeight="bold">
              Votes
            </Heading>
            <OrderedList>
              {votes.map(([_, desc]: any) => (
                <ListItem key={desc}> {desc} </ListItem>
              ))}
            </OrderedList>
          </Card>
        ) : null}
        <Card bg={bgColor} mt="2" overflowY="auto" maxH="300">
          <Heading as="h4" mb="4" size="md">
            Description
          </Heading>
          <ReactMarkdown
            children={taskDescriptionMarkdown}
            remarkPlugins={[remarkGfm]}
          ></ReactMarkdown>
        </Card>
      </SimpleGrid>

      {isDiscussing && isModerator ? (
        <SimpleGrid p={1} columns={[1, 1, 2, 2]}>
          <Button
            w="80%"
            justifySelf="center"
            colorScheme="blue"
            onClick={replayRound}
          >
            Replay round
          </Button>
          <Button
            w="80%"
            justifySelf="center"
            colorScheme="blue"
            onClick={nextRound}
          >
            Next round
          </Button>
        </SimpleGrid>
      ) : (
        <>
          {pokerButtons}
          {isModerator ? (
            <Button
              w="60%"
              justifySelf="center"
              colorScheme="blue"
              onClick={revealCards}
            >
              Reveal cards
            </Button>
          ) : null}
        </>
      )}
    </SimpleGrid>
  );
}

export default Game;
