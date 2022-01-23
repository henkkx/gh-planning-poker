import {
  Button,
  Heading,
  Select,
  SimpleGrid,
  useBreakpointValue,
  useColorModeValue,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card } from "../../../components/Card";
import { ScrollArea } from "../../../components/SidebarMenu/ScrollArea";
import { FullPageProgress } from "../../../components/Spinner";
import { ErrorCard } from "../../error";
import { VOTING_OPTIONS, UNSURE } from "../constants";
import { GameState, Task } from "./machine";
import SaveNoteForm from "./save-note-form";
import { chakraMarkdownComponents } from "./utils";
import Votes from "./votes";

type Props = {
  sendVote: (value: number) => void;
  stage: GameState;
  currentTask?: Task;
  replayRound: () => void;
  revealCards: () => void;
  finishRound: () => void;
  saveRound: (shouldSaveRound: boolean, note: string) => void;
  isModerator: boolean;
};

function Game({
  sendVote,
  stage,
  currentTask,
  revealCards,
  replayRound,
  finishRound,
  saveRound,
  isModerator,
}: Props) {
  const bgColor = useColorModeValue("gray.50", "gray.600");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedValue, setSelectedValue] = React.useState<number>(1);

  const isConnecting = stage === "connecting";
  const isVoting = stage === "voting";
  const isDiscussing = stage === "discussing";
  const isFinished = stage === "finished";
  const isSavingResults = stage === "saving";

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

  const { votes, stats } = currentTask as Task;

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
          onClick={() => sendVote(id)}
        >
          {id < UNSURE ? id : label}
        </Button>
      ))}
    </SimpleGrid>
  );

  const taskDescription = (
    <Card bg={bgColor} mt="2" maxH="300">
      <ScrollArea h="250">
        <Heading as="h4" mb="4" size="md">
          Description
        </Heading>
        <ReactMarkdown
          children={taskDescriptionMarkdown}
          remarkPlugins={[remarkGfm]}
          components={chakraMarkdownComponents}
          skipHtml
        ></ReactMarkdown>
      </ScrollArea>
    </Card>
  );
  return (
    <SimpleGrid w="100%">
      <SimpleGrid columns={1} px={["1%", "2%", "5%", "10%"]}>
        {isDiscussing ? (
          <Tabs variant="enclosed" mt="2" isFitted w="100%">
            <TabList>
              <Tab>Player Votes</Tab>
              <Tab>Task Description</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Votes votes={votes} stats={stats} bgColor={bgColor} />
              </TabPanel>
              <TabPanel>{taskDescription}</TabPanel>
            </TabPanels>
          </Tabs>
        ) : null}

        {isSavingResults && isModerator ? (
          <SaveNoteForm saveRound={saveRound} />
        ) : null}

        {isVoting ? taskDescription : null}
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
            onClick={finishRound}
          >
            Finish this round
          </Button>
        </SimpleGrid>
      ) : (
        <>
          {isVoting ? pokerButtons : null}
          {isModerator && isVoting ? (
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