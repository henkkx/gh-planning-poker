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
import { NotFoundCard } from "./not-found-card";

export const NotFound = () => {
  return (
    <Box maxW="5xl" mt={12} mx="auto" px={{ sm: "8" }}>
      <NotFoundCard />
    </Box>
  );
};
