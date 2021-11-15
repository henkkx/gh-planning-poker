import {
  Input as ChakraInput,
  InputProps,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

export const Input = (props: InputProps) => (
  <ChakraInput
    bg={useColorModeValue("white", "gray.800")}
    borderColor={useColorModeValue("gray.200", "gray.500")}
    focusBorderColor={useColorModeValue("blue.500", "blue.300")}
    _hover={{
      borderColor: useColorModeValue("gray.300", "gray.400"),
    }}
    {...props}
  />
);
