import {
  Box,
  Divider,
  Heading,
  Stack,
  Img,
  Text,
  Center,
  Button,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { Card } from "../../components/Card";

import ErrorImg from "./error.svg";
import { Link } from "react-router-dom";

const DEFAULT_MESSAGE = "We could not find the the page you're looking for.";

type Props = {
  message?: string;
};

export const ErrorCard = ({ message }: Props) => {
  const refreshPage = () => {
    window.location.reload();
  };
  return (
    <Card>
      <Stack direction={["column", "row"]} spacing="24px">
        <Box>
          <Heading size="3xl" mb="4">
            {message ?? DEFAULT_MESSAGE}
          </Heading>
          <Text> Error: 404 Not Found </Text>
          <Divider mb="6" />
          <Center>
            <VStack>
              <Button onClick={refreshPage}> Try Again </Button>
              <Button as={Link} to="/">
                Take Me Back to the Home Page
              </Button>
            </VStack>
          </Center>
        </Box>
        <Img maxW="xs" src={ErrorImg} />
      </Stack>
    </Card>
  );
};
