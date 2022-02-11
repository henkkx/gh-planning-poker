import {
  chakra,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  SimpleGrid,
  Checkbox,
  useBoolean,
  FormControl,
  FormLabel,
  Switch,
  Input,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card } from "../../../components/Card";
import { NoteTextArea } from "../../../components/Form/NoteTextArea";
import { ScrollArea } from "../../../components/SidebarMenu/ScrollArea";
import { FullPageProgress } from "../../../components/Spinner";
import { chakraMarkdownComponents } from "./utils";

export type RoundNotes = {
  should_save_round: boolean;
  note?: string;
  label?: string;
};

type Props = {
  finishRound: (data: RoundNotes) => void;
};

function SaveNoteForm({ finishRound }: Props) {
  const textColor = useColorModeValue("gray.600", "gray.50");
  const bgColor = useColorModeValue("gray.50", "gray.600");
  const [isLoading, setIsLoading] = React.useState(false);

  const [note, setNote] = React.useState<string>("");

  const isTextOverLimit = note.length > 4000;

  let handleInputChange = (e: any) => {
    let inputValue = e.currentTarget.value;
    setNote(inputValue);
  };

  let handleSubmitNote = (e: any) => {
    e.preventDefault();
    const { labelInput } = e.currentTarget.elements;
    const label = labelInput.value;
    setIsLoading(true);
    finishRound({ should_save_round: true, note, label });
  };

  let handleSkipSaving = () => finishRound({ should_save_round: false, note });

  if (isLoading) {
    return <FullPageProgress text="Exporting to Github..." />;
  }

  return (
    <chakra.form onSubmit={handleSubmitNote}>
      <Tabs variant="soft-rounded" mt="2" isFitted w="100%">
        <TabList>
          <Tab color={textColor}>Edit Note</Tab>
          <Tab color={textColor}>Preview of the Markdown</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <NoteTextArea
              bg={bgColor}
              maxH="350"
              value={note}
              isInvalid={isTextOverLimit}
              onChange={handleInputChange}
            />
          </TabPanel>
          <TabPanel>
            <Card mt="2" maxH="350" bg={bgColor}>
              <ScrollArea h="350">
                <ReactMarkdown
                  children={
                    note ??
                    "Type something in the editor to see what it looks like"
                  }
                  remarkPlugins={[remarkGfm]}
                  components={chakraMarkdownComponents}
                  skipHtml
                />
              </ScrollArea>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Flex justify="center">
        <FormControl maxW="90%" id="labelInput">
          <FormLabel mb="0">Enter a label for the issue (optional) </FormLabel>
          <Input id="labelInput" type="text" />
        </FormControl>
      </Flex>

      <SimpleGrid p={1} columns={[1, 1, 2, 2]}>
        <Button onClick={handleSkipSaving} w="80%" mt="2" justifySelf="center">
          Don't save this round
        </Button>
        <Button
          colorScheme="blue"
          type="submit"
          w="80%"
          mt="2"
          justifySelf="center"
          isDisabled={isTextOverLimit}
        >
          Save and export to Github
        </Button>
      </SimpleGrid>
    </chakra.form>
  );
}

export default SaveNoteForm;
