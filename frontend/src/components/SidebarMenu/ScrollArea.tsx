import { Box, BoxProps, useColorModeValue as mode } from "@chakra-ui/react";

export const ScrollArea = (props: BoxProps) => (
  <Box
    overflowY="auto"
    minH="px"
    height="90vh"
    maxH="full"
    {...props}
    sx={{
      "&::-webkit-scrollbar-track": {
        bg: "transparent",
      },
      "&::-webkit-scrollbar": {
        width: "4px",
      },
      "&::-webkit-scrollbar-thumb": {
        bg: mode("cyan.800", "gray.700"),
        borderRadius: "20px",
      },
    }}
  />
);
