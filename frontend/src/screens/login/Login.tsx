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
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import { Card } from "../../components/Card";
import { DividerWithText } from "../../components/DividerWIthText";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID ?? "";
const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";

function redirect(url: string, params: URLSearchParams) {
  window.location.href = `${url}?${params.toString()}`;
}

function createUrlParams() {
  const scope = ["user", "repo"].join(" ");

  const params = {
    response_type: "code",
    client_id: CLIENT_ID,
    // redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
    scope,
  };
  return new URLSearchParams(params);
}

function openGithubLoginPage() {
  // const redirectUri = "github-callback";
  const urlParams = createUrlParams();
  redirect(GITHUB_AUTH_URL, urlParams);
}

function Login() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "inherit")}
      minH="100vh"
      py="12"
      px={{ base: "4", lg: "8" }}
    >
      <Box maxW="md" mx="auto">
        <Card>
          <Heading textAlign="center" size="xl" fontWeight="extrabold">
            Sign in
          </Heading>
          <Box mt="6" align="center" justify="center">
            <Button leftIcon={<FaGithub />} onClick={openGithubLoginPage}>
              Login with Github
            </Button>
            <Button
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
    </Box>
  );
}

export default Login;
