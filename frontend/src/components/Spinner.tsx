import { Box, Heading } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";

const FullPageProgress = ({ text }: any) => (
  <Box
    fontSize="4em"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
  >
    {text ? (
      <Heading as="h3" size="lg" mb="2">
        {text}
      </Heading>
    ) : null}
    <Spinner size="xl" />
  </Box>
);

export { FullPageProgress, Spinner };
