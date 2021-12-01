import {
  Box,
  Button,
  chakra,
  Divider,
  Heading,
  Stack,
  useBoolean,
  useColorModeValue,
  Img,
  Text,
  Center,
} from "@chakra-ui/react";
import * as React from "react";
import { Card } from "../../components/Card";

import NotFoundImg from "./not-found.svg";
import { Link } from "react-router-dom";

const DEFAULT_MESSAGE = "We could not find the the page you're looking for.";

type Props = {
  message?: string;
};

export const NotFoundCard = ({ message }: Props) => {
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
            <Button as={Link} to="/">
              Take Me Back to the Home Page
            </Button>
          </Center>
        </Box>
        <Img maxW="xs" src={NotFoundImg} />
      </Stack>
    </Card>
  );
};
