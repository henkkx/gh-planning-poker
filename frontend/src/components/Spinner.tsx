import { Flex, Heading } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";

const FullPageProgress = ({ text }: { text?: string }) => (
  <Flex
    fontSize="4em"
    height="90vh"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
  >
    {text ? (
      <Heading as="h3" size="xl" m="4">
        {text}
      </Heading>
    ) : null}
    <Spinner size="xl" />
  </Flex>
);

export { FullPageProgress, Spinner };
