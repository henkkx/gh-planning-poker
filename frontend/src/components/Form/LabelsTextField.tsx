import { FormControl, FormLabel, InputProps } from "@chakra-ui/react";
import { Input } from "./Input";

export const LabelsTextField = (props: InputProps) => {
  return (
    <FormControl id="labelsInput">
      <FormLabel>
        Enter the labels, separated by commas, by which the issues will be
        filtered (leave empty to choose all issues)
      </FormLabel>
      <Input type="text" {...props} placeholder="label1,label2 " />
    </FormControl>
  );
};
