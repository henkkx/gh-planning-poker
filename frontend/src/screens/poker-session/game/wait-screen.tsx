import { VStack, Box, Heading, Img } from "@chakra-ui/react";
import { Card } from "../../../components/Card";
import WaitingImg from "./waiting.svg";

export default function WaitScreen({ text }: { text?: string }) {
  return (
    <Card justifySelf="center" maxW="95%" maxH="90%">
      <VStack>
        <Img maxW="90%" p="5" src={WaitingImg} />
        <Box mb="5">
          <Heading size="lg" mb="4">
            {text ?? " Waiting for next round to start... "}
          </Heading>
        </Box>
      </VStack>
    </Card>
  );
}
