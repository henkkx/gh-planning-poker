import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Circle,
  Collapse,
  Heading,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import useStep from "./useStep";

interface StepProps extends BoxProps {
  title?: string;
  tooltip?: any;
  tooltipProps: Record<string, string>;
}

export function Step(props: StepProps) {
  const { title, children, tooltip, tooltipProps, ...boxProps } = props;
  const { isActive, isCompleted, step } = useStep();

  const accentColor = useColorModeValue("teal.500", "teal.300");
  const mutedColor = useColorModeValue("gray.500", "whiteAlpha.700");
  const activeColor = useColorModeValue("white", "black");

  let Tooltip = tooltip;

  return (
    <Tooltip {...tooltipProps}>
      <Box {...boxProps}>
        <HStack spacing="4">
          <Circle
            size="8"
            fontWeight="bold"
            color={
              isActive ? activeColor : isCompleted ? accentColor : mutedColor
            }
            bg={isActive ? accentColor : "transparent"}
            borderColor={isCompleted ? accentColor : mutedColor}
            borderWidth={isActive ? "0px" : "1px"}
          >
            {isCompleted ? <Icon as={CheckIcon} /> : step}
          </Circle>

          <Heading
            fontSize="lg"
            fontWeight="semibold"
            color={isActive || isCompleted ? "whiteAlpha.900" : mutedColor}
          >
            {title}
          </Heading>
        </HStack>
        <Collapse in={isActive}>{children}</Collapse>
      </Box>
    </Tooltip>
  );
}
