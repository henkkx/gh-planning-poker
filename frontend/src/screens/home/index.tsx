import {
  Box,
  Button,
  Flex,
  Heading,
  Img,
  SimpleGrid,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { useAuth } from "../../auth";
import { usePathname } from "../../utils/hooks";
import Login, { GithubButton } from "../login";
import HeroImg from "./hero_illustration.svg";

function Home() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const path = usePathname();

  if (!isAuthenticated) {
    if (path == "/login") {
      return <Login />;
    } else if (path !== "/") {
      return <Redirect to="/" />;
    }
  }

  return (
    <Box
      pt="24"
      pb="12"
      maxW={{ base: "xl", md: "7xl" }}
      mx="auto"
      px={{ base: "6", md: "8" }}
    >
      <Flex
        align="flex-start"
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        mb="20"
      >
        <Box flex="1" maxW={{ lg: "xl" }} pt="6">
          <Heading as="h1" size="3xl" mt="8" fontWeight="extrabold">
            {isAuthenticated
              ? `Welcome ${user.name}`
              : "Online Planning Poker with Github Integration"}
          </Heading>
          <Text color={mode("gray.600", "gray.400")} mt="5" fontSize="xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua
            adipiscing elit.
          </Text>

          <Button
            mt="8"
            minW="14rem"
            colorScheme="blue"
            size="lg"
            height="14"
            px="8"
            fontSize="md"
            fontWeight="bold"
            as={RouterLink}
            to={isAuthenticated ? "/play" : "/login"}
          >
            Get Started for free
          </Button>
        </Box>
        <Box boxSize={{ base: "20", lg: "8" }} />
        <Img
          pos="relative"
          marginEnd="-10rem"
          w="50rem"
          src={HeroImg}
          alt="Illustration of a software team"
        />
      </Flex>
      <Box>
        <Text color={mode("gray.600", "gray.400")} mt="5" fontSize="sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua adipiscing
          elit.
        </Text>
      </Box>
    </Box>
  );
}

export default Home;
