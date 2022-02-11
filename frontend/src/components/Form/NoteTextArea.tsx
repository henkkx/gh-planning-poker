import { TextareaProps, Textarea } from "@chakra-ui/react";
import { FormField } from "./FormField";

export const NoteTextArea = (props: TextareaProps) => {
  return (
    <FormField
      id="noteText"
      labelText="Save a note about the results of the round"
    >
      <Textarea minH="200" placeholder="type something here..." {...props} />
    </FormField>
  );
};
