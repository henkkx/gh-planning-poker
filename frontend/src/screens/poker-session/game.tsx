import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";

const NOT_DOABLE = 100;
const UNSURE = 99;
type VotingOptions = Array<[number, string]>;
const VOTING_OPTIONS: VotingOptions = [
  [1, "1 hour"],
  [2, "2 hours"],
  [3, "3 hours"],
  [5, "5 hours"],
  [8, "8 hours"],
  [13, "13 hours"],
  [20, "20 hours"],
  [40, "40 hours"],
  [UNSURE, "?"],
  [NOT_DOABLE, "∞"],
];

const OTHER_OPTIONS = {};

type Props = {
  sendVote: (vote: number) => void;
};

function Game({ sendVote }: Props) {
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <SimpleGrid>
      <Flex
        align="center"
        justifyContent="center"
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        mb="20"
      >
        <Box flex="1" maxW={{ lg: "lg" }} pt="6">
          <Heading as="h1" size="xl" mt="8" fontWeight="extrabold">
            Online Planning Poker with Github Integration
          </Heading>
          <Text color={textColor} mt="5" fontSize="xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua
            adipiscing elit.
          </Text>
        </Box>
      </Flex>
      <Box>
        {VOTING_OPTIONS.map(([id, label]) => (
          <Button
            key={id}
            mt="8"
            mx="2"
            minW="6rem"
            minH="8rem"
            colorScheme="green"
            size="md"
            height="14"
            fontSize="3xl"
            fontWeight="bold"
            onClick={(e) => sendVote(id)}
          >
            {id < UNSURE ? id : label}
          </Button>
        ))}
      </Box>
    </SimpleGrid>
  );
}

export default Game;
