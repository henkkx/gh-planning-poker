import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import * as React from "react";
import { FaGithub } from "react-icons/fa";
import { openGithubLoginPage } from "../../auth/github";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import { Card } from "../../components/Card";

function Login() {
  return (
    <Box
      display="flex"
      bg={useColorModeValue("gray.50", "inherit")}
      minH="100vh"
      py="12"
      px={{ base: "4", lg: "8" }}
    >
      <Box maxW="lg" mx="auto" align="center">
        <Card>
          <Heading textAlign="center" size="xl" fontWeight="extrabold">
            Planning Poker for Github
          </Heading>
          <Box mt="8" align="center" justify="center">
            <Button leftIcon={<FaGithub />} onClick={openGithubLoginPage}>
              Login with Github
            </Button>
            <br />
            <Button
              mt="2"
              onClick={() => {
                fetch(`/github/test/`)
                  .then((res) => res.json())
                  .then(console.log);
              }}
            >
              print name to console
            </Button>
          </Box>
        </Card>
      </Box>
      <ColorModeSwitcher justifySelf="flex-end" />
    </Box>
  );
}

export default Login;
