import {
  FormControl,
  FormLabel,
  TextareaProps,
  Textarea,
} from "@chakra-ui/react";

export const NoteTextArea = (props: TextareaProps) => {
  return (
    <FormControl id="noteText">
      <FormLabel>Save a note about the results of the round</FormLabel>
      <Textarea minH="200" placeholder="type something here..." {...props} />
    </FormControl>
  );
};
