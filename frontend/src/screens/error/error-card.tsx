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

import DefaultErrorImg from "./error.svg";
import { Link } from "react-router-dom";

const DEFAULT_MESSAGE = "We could not find the the page you're looking for.";

type Props = {
  message?: string;
  canTryAgain?: boolean;
  onTryAgain?: React.MouseEventHandler<HTMLButtonElement>;
  errorText?: string;
  illustration?: string;
};

export const ErrorCard = ({
  message,
  canTryAgain,
  onTryAgain,
  errorText,
  illustration,
}: Props) => {
  return (
    <Card>
      <Stack direction={["column", "row"]} spacing="24px">
        <Box>
          <Heading size="3xl" mb="4">
            {message ?? DEFAULT_MESSAGE}
          </Heading>
          <Text> {errorText ?? "Error: 404 Not Found"} </Text>
          <Divider mb="6" />
          <Center>
            <VStack>
              {canTryAgain ? (
                <Button onClick={onTryAgain}> Try Again </Button>
              ) : null}
              <Button as={Link} to="/">
                Take Me Back to the Home Page
              </Button>
            </VStack>
          </Center>
        </Box>
        <Img maxW="xs" src={illustration ?? DefaultErrorImg} />
      </Stack>
    </Card>
  );
};
