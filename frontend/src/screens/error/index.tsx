import { Box } from "@chakra-ui/react";
import * as React from "react";

import { ErrorCard } from "./error-card";

const ErrorScreen = () => {
  return (
    <Box maxW="5xl" mt={12} mx="auto" px={{ sm: "8" }}>
      <ErrorCard />
    </Box>
  );
};

export { ErrorCard };

export default ErrorScreen;
