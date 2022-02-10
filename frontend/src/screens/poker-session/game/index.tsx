import {
  Button,
  Heading,
  Select,
  SimpleGrid,
  useColorModeValue,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Img,
} from "@chakra-ui/react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card } from "../../../components/Card";
import { ScrollArea } from "../../../components/SidebarMenu/ScrollArea";
import { FullPageProgress } from "../../../components/Spinner";
import { useIsMobile } from "../../../utils/hooks";
import { ErrorCard } from "../../error";
import { VOTING_OPTIONS, UNSURE, INITIAL_VOTE_VALUE } from "../constants";
import { GameState, Task } from "./machine";
import SaveNoteForm from "./save-note-form";
import { chakraMarkdownComponents } from "./utils";
import Votes from "./votes";
import WaitScreen from "./wait-screen";

export type RoundNotes = {
  should_save_round: boolean;
  note?: string;
  label?: string;
};

type Props = {
  sendVote: (value: number) => void;
  stage: GameState;
  currentTask?: Task;
  replayRound: () => void;
  revealCards: () => void;
  finishDiscussion: () => void;
  finishRound: (data: RoundNotes) => void;
  isModerator: boolean;
};

function Game({
  sendVote,
  stage,
  currentTask,
  revealCards,
  replayRound,
  finishDiscussion,
  finishRound,
  isModerator,
}: Props) {
  const bgColor = useColorModeValue("gray.50", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.50");
  const isMobile = useIsMobile();
  const [voteValue, setVoteValue] = React.useState<number>(INITIAL_VOTE_VALUE);

  React.useEffect(() => {
    setVoteValue(INITIAL_VOTE_VALUE);
  }, [stage]);

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
    setVoteValue(parseInt(e.target.value));

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
        mx={[1, 2, 2]}
        colorScheme="blue"
        onClick={(_) => sendVote(voteValue)}
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
    <Card bg={bgColor} maxH="400" mb="2">
      <ScrollArea maxH="350">
        <Heading as="h3" mb="4" size="lg">
          {currentTask?.title}
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
        {isVoting ? taskDescription : null}

        {isDiscussing ? (
          <Tabs mt="2" variant="soft-rounded" isFitted w="100%">
            <TabList>
              <Tab color={textColor}>Player Votes</Tab>
              <Tab color={textColor}>Task Description</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Votes votes={votes} stats={stats} bgColor={bgColor} />
              </TabPanel>
              <TabPanel>{taskDescription}</TabPanel>
            </TabPanels>
          </Tabs>
        ) : null}

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
              onClick={finishDiscussion}
            >
              Finish this round
            </Button>
          </SimpleGrid>
        ) : null}

        {isSavingResults ? (
          isModerator ? (
            <SaveNoteForm saveRound={finishRound} />
          ) : (
            <WaitScreen />
          )
        ) : null}
      </SimpleGrid>

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
    </SimpleGrid>
  );
}

export default Game;
