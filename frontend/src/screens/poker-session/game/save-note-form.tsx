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
} from "@chakra-ui/react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card } from "../../../components/Card";
import { NoteTextArea } from "../../../components/Form/NoteTextArea";
import { ScrollArea } from "../../../components/SidebarMenu/ScrollArea";
import { chakraMarkdownComponents } from "./utils";

function SaveNoteForm({ saveRound }: any) {
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
    saveRound({ should_save_round: true, note, label });
  };

  let handleSkipSaving = () => saveRound({ should_save_round: false, note });

  return (
    <chakra.form onSubmit={handleSubmitNote}>
      <Tabs variant="enclosed" mt="2" isFitted w="100%">
        <TabList>
          <Tab>Edit Note</Tab>
          <Tab>Preview of the Markdown</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <NoteTextArea
              maxH="350"
              value={note}
              isInvalid={isTextOverLimit}
              onChange={handleInputChange}
            />
          </TabPanel>
          <TabPanel>
            <Card mt="2" maxH="300" minH="300">
              <ScrollArea h="250">
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
