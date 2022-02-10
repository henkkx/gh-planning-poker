import { Box, Button } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { openGithubLoginPage } from "../../auth";

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
