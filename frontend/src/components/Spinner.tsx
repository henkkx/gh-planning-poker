import { Box } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";
import * as React from "react";

const FullPageProgress = () => (
  <Box
    fontSize="4em"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
  >
    <Spinner size="xl" />
  </Box>
);

export { FullPageProgress, Spinner };
