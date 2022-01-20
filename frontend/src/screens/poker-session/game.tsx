import {
  Button,
  Heading,
  ListItem,
  OrderedList,
  Select,
  SimpleGrid,
  useBreakpointValue,
  useColorModeValue,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card } from "../../components/Card";
import { ScrollArea } from "../../components/SidebarMenu/ScrollArea";
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
  nextRound: any;
  isModerator: boolean;
};

function Game({
  sendVote,
  stage,
  currentTask,
  revealCards,
  replayRound,
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
          onClick={(_) => sendVote(id)}
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
                <Card bg={bgColor} mt="2" maxH="300">
                  <ScrollArea h="250">
                    {votes.length ? (
                      <Table size="sm" mb="5">
                        <Thead>
                          <Tr>
                            <Th isNumeric>Total Votes</Th>
                            <Th isNumeric>Unsure votes</Th>
                            <Th isNumeric>Mean (h)</Th>
                            <Th isNumeric>Median (h)</Th>
                            <Th isNumeric>Standard Deviation (h)</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td isNumeric> {stats.total_vote_count} </Td>
                            <Td isNumeric> {stats.undecided_count} </Td>
                            <Td isNumeric> {stats.mean} </Td>
                            <Td isNumeric> {stats.median} </Td>
                            <Td isNumeric>{stats.std_dev}</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    ) : (
                      "No votes were cast..."
                    )}

                    <OrderedList>
                      {votes.map((description: string) => (
                        <ListItem key={description}> {description} </ListItem>
                      ))}
                    </OrderedList>
                  </ScrollArea>
                </Card>
              </TabPanel>
              <TabPanel>{taskDescription}</TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          taskDescription
        )}
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
