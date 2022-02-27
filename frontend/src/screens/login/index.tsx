import {
  Box,
  chakra,
  Flex,
  Heading,
  Img,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { GithubButton } from "./github-button";

import HeroImg from "../home/hero_illustration.svg";

function Login() {
  return (
    <Box maxW={{ base: "xl", md: "7xl" }} mx="auto" px={{ base: "6", md: "8" }}>
      <Flex
        align="flex-start"
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        mb="20"
      >
        <Box flex="1" maxW={{ lg: "xl" }} pt="6">
          <Heading as="h1" size="2xl" mt="8" fontWeight="extrabold">
            Online Planning Poker with Github Integration
          </Heading>
          <Heading as="h3" size="md" mt="4">
            Disclaimer about github oauth scopes:{" "}
          </Heading>
          <Text color={mode("gray.600", "gray.400")} mt="5" fontSize="md">
            When logging in with Github, the app asks for the 'repo' oauth scope
            which gives it a lot of privileges. This is because the app needs
            access to repo's issues but, frustratingly for developers, the
            Github oauth scopes are not at all granular.{" "}
            <chakra.a
              color="teal"
              href="https://github.com/jollygoodcode/jollygoodcode.github.io/issues/6 "
            >
              Here's an issue from 2015
            </chakra.a>{" "}
            in which this topic is discussed but it has still not been resolved.
            I therefore ask that you please understand that I'm only asking for
            the permissions because there does not seem to be another option.
            The app ONLY writes to the issues of your selected repo if you
            choose to do so. However, I understand that someone might still not
            be comfortable with this. Github's suggestion in this case seems to
            be creating a 'machine user' that has access to a very specific set
            of resources in a given repo. One can then login and play using that
            user. Thanks for your understanding!
          </Text>

          <GithubButton />
        </Box>
        <Img
          marginEnd="-5rem"
          mt="40"
          w="50rem"
          src={HeroImg}
          alt="Illustration of a software team"
        />
      </Flex>
    </Box>
  );
}

export default Login;
