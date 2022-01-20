import {
  chakra,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card } from "../../../components/Card";
import { NoteTextArea } from "../../../components/Form/NoteTextArea";
import { ScrollArea } from "../../../components/SidebarMenu/ScrollArea";
import { chakraMarkdownComponents } from "./utils";

function SaveNoteForm({ saveRound }: any) {
  const [textNote, setTextNote] = React.useState<string>("");

  let handleInputChange = (e: any) => {
    let inputValue = e.currentTarget.value;
    setTextNote(inputValue);
  };

  let handleSubmitNote = (e: any) => {
    e.preventDefault();
    saveRound(true, textNote);
  };

  let handleSkipSaving = () => saveRound(false, null);

  return (
    <chakra.form onSubmit={handleSubmitNote}>
      <Tabs variant="enclosed" mt="2" isFitted w="100%">
        <TabList>
          <Tab>Edit Note</Tab>
          <Tab>Preview of the Markdown</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <NoteTextArea value={textNote} onChange={handleInputChange} />
          </TabPanel>
          <TabPanel>
            <Card mt="2" maxH="300" minH="300">
              <ScrollArea h="250">
                <ReactMarkdown
                  children={
                    textNote ??
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
        >
          Save and export to Github
        </Button>
      </SimpleGrid>
    </chakra.form>
  );
}

export default SaveNoteForm;
