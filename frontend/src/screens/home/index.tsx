import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Img,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { useAuth } from "../../auth";
import { usePathname } from "../../utils/hooks";
import Login from "../login";
import HeroImg from "./hero_illustration.svg";

function Home() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const path = usePathname();

  if (!isAuthenticated) {
    if (path === "/login") {
      return <Login />;
    } else if (path !== "/") {
      return <Redirect to="/" />;
    }
  }

  return (
    <Box maxW={{ base: "xl", md: "7xl" }} mx="auto" px={{ base: "6", md: "8" }}>
      <Flex
        align="flex-start"
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        mb="20"
      >
        <Box flex="1" maxW={{ lg: "xl" }} py="6">
          <Heading as="h1" size="3xl" mt="8" fontWeight="extrabold">
            {isAuthenticated
              ? `Welcome ${user!.name}`
              : "Online Planning Poker with Github Integration"}
          </Heading>
          <Text color={mode("gray.600", "gray.400")} mt="5" fontSize="xl">
            Planning poker is a consensus-based and gamified technique for
            software engineering teams to estimate and discuss tasks and user
            stories. This app can fetch the issues from your Github repository
            and allow you to run planning poker sessions on them.
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
            Get Started!
          </Button>
        </Box>
        <Img
          pt="10"
          marginEnd="-10rem"
          w="50rem"
          src={HeroImg}
          alt="Illustration of a software team"
        />
      </Flex>
      <chakra.footer>
        <Text color={mode("gray.600", "gray.400")} mt="5" fontSize="md">
          For more information about planning poker check out the{" "}
          <chakra.a
            color="lightblue"
            href="https://www.atlassian.com/blog/platform/a-brief-overview-of-planning-poker"
          >
            Brief Overview of Planning Poker by Atlassian
          </chakra.a>
        </Text>
      </chakra.footer>
    </Box>
  );
}

export default Home;
