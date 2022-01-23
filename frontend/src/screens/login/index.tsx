import { Box, Button, Heading, useColorModeValue } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { openGithubLoginPage } from "../../auth/github";
import { Card } from "../../components/Card";

export function GithubButton() {
  return (
    <Box mt="8" align="center" justify="center">
      <Button
        size="lg"
        leftIcon={<FaGithub />}
        onClick={() => openGithubLoginPage({ state: window.location.href })}
      >
        Login with Github
      </Button>
    </Box>
  );
}

function Login() {
  return (
    <Box
      display="flex"
      bg={useColorModeValue("gray.50", "inherit")}
      minH="100vh"
      mawW="500px"
      py="12"
      px={{ base: "4", lg: "8" }}
    >
      <Box mx="auto" align="center">
        <Heading
          color="teal"
          as="h1"
          size="2xl"
          mt="2"
          mb="12"
          fontWeight="extrabold"
        >
          Planning Poker For Github
        </Heading>

        <Card>
          <Heading
            textAlign="center"
            color="gray.700"
            size="xl"
            fontWeight="extrabold"
          >
            Login to Get Started
          </Heading>

          <GithubButton />
        </Card>
      </Box>
    </Box>
  );
}

export default Login;
