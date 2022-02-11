import {
  SimpleGrid,
  useColorModeValue,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { FullPageProgress } from "../../../components/Spinner";
import { GameState, Task } from "./machine";
import ModeratorButton from "./moderator-button";
import PokerButtons from "./poker-buttons";
import SaveNoteForm, { RoundNotes } from "./save-note-form";
import TaskDescription from "./task-description";
import Votes from "./votes";
import WaitScreen from "./wait-screen";

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

  const isConnecting = stage === "connecting";
  const isVoting = stage === "voting";
  const isDiscussing = stage === "discussing";
  const isSavingResults = stage === "saving";

  if (isConnecting) {
    return <FullPageProgress />;
  }

  const { votes, stats, title, description } = currentTask as Task;

  const taskDescription = (
    <TaskDescription
      description={description}
      title={title}
      bgColor={bgColor}
    />
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
            <ModeratorButton onClick={replayRound}>
              Replay round
            </ModeratorButton>
            <ModeratorButton onClick={finishDiscussion}>
              Finish this round
            </ModeratorButton>
          </SimpleGrid>
        ) : null}

        {isSavingResults ? (
          isModerator ? (
            <SaveNoteForm finishRound={finishRound} />
          ) : (
            <WaitScreen />
          )
        ) : null}
      </SimpleGrid>

      {isVoting ? <PokerButtons sendVote={sendVote} stage={stage} /> : null}
      {isModerator && isVoting ? (
        <ModeratorButton onClick={revealCards}>Reveal cards</ModeratorButton>
      ) : null}
    </SimpleGrid>
  );
}

export { Game };
