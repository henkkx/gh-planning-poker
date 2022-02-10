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
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../auth";
import HeroImg from "./hero_illustration.svg";

function Home() {
  const { user } = useAuth();

  return (
    <Box maxW={{ base: "xl", md: "7xl" }} mx="auto" px={{ base: "6", md: "8" }}>
      <Flex
        align="flex-start"
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        mb="20"
      >
        <Box flex="1" maxW={{ lg: "xl" }} pt="6">
          <Heading as="h1" size="3xl" mt="8" fontWeight="extrabold">
            {`Welcome ${user!.name}`}
          </Heading>
          <Text color={mode("gray.600", "gray.400")} mt="5" fontSize="xl">
            Planning poker is a consensus-based and gamified technique for task
            estimation. It is used by software engineering teams to discuss user
            stories in the form of a poker-like card game. This app will allow
            you to run planning poker sessions on issues imported from your
            Github repository.
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
            to={"/play"}
          >
            Get Started!
          </Button>
        </Box>
        <Img
          marginEnd="-5rem"
          mt="10"
          w="50rem"
          src={HeroImg}
          alt="Illustration of a software team"
        />
      </Flex>
      <chakra.footer>
        <Text color={mode("gray.600", "gray.400")} my="5" fontSize="md">
          For more information about planning poker check out the{" "}
          <chakra.a
            color={mode("blue.600", "blue.400")}
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
