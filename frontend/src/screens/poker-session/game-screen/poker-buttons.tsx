import * as React from "react";
import { SimpleGrid, Select, Button } from "@chakra-ui/react";
import { useIsMobile } from "../../../utils/hooks";
import {
  INITIAL_VOTE_VALUE,
  VOTING_OPTIONS,
  UNSURE,
} from "../../../utils/constants";
import { GameState } from "./machine";

type Props = {
  stage: GameState;
  sendVote: (value: number) => void;
};

export default function PokerButtons({ sendVote, stage }: Props) {
  const isMobile = useIsMobile();
  const [voteValue, setVoteValue] = React.useState<number>(INITIAL_VOTE_VALUE);

  React.useEffect(() => {
    setVoteValue(INITIAL_VOTE_VALUE);
  }, [stage, setVoteValue]);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setVoteValue(parseInt(e.target.value));

  return isMobile ? (
    <SimpleGrid m={2} maxW={"100%"} columns={[1, 2, 2]}>
      <Select size="lg" onChange={handleSelectionChange}>
        {VOTING_OPTIONS.map(([id, label]) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </Select>
      <Button
        mx={[6, 2, 2]}
        colorScheme="blue"
        onClick={() => sendVote(voteValue)}
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
}
