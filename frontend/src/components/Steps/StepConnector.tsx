import { Box, useColorModeValue } from "@chakra-ui/react";
import useStep from "./useStep";

function StepConnector() {
  const { isCompleted, isActive } = useStep();
  const accentColor = useColorModeValue("teal.500", "teal.300");

  return (
    <Box
      borderStartWidth="1px"
      borderStartColor={isCompleted ? accentColor : "inherit"}
      height="6"
      mt={isActive ? "0" : "2"}
      mb="2"
      ms="4"
      ps="4"
    />
  );
}

export default StepConnector;
