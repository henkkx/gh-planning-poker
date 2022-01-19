import { FormControl, FormLabel, InputProps } from "@chakra-ui/react";
import { Input } from "./Input";

export const LabelsTextField = (props: InputProps) => {
  return (
    <FormControl id="labelsInput">
      <FormLabel>
        Type here, separated by commas, the labels by which issues will be
        filtered (or leave empty to choose all)
      </FormLabel>
      <Input type="text" {...props} placeholder="label1,label2,...,labelN" />
    </FormControl>
  );
};
