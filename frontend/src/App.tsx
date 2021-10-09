import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Button,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";

export const App = () => {
  React.useEffect(() => {
    fetch(`http://localhost:8000/api/test?text=testing`)
      .then((res) => res.json())
      .then(console.log);
  });

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          hello world
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
