import { InputProps } from "@chakra-ui/react";
import { FormField } from "./FormField";
import { Input } from "./Input";

export const LabelsTextField = (props: InputProps) => {
  return (
    <FormField
      labelText="Type here, separated by commas, the labels by which issues will be
    filtered (or leave empty to choose all)"
      id="labelsInput"
    >
      <Input type="text" {...props} placeholder="label1,label2,...,labelN" />
    </FormField>
  );
};
