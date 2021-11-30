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

export const NotFound = () => {
  return (
    <Box maxW="5xl" mt={12} mx="auto" px={{ sm: "8" }}>
      <Card>
        <Stack direction={["column", "row"]} spacing="24px">
          <Box>
            <Heading size="3xl" mb="4">
              We could not find the the page you're looking for.
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
    </Box>
  );
};
