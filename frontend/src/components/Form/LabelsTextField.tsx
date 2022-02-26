import { InputProps } from "@chakra-ui/react";
import { FormField } from "./FormField";
import { Input } from "./Input";

export const LabelsTextField = (props: InputProps) => {
  return (
    <FormField
      labelText="Enter labels by which issues will be
    filtered (or leave empty to choose all). They should be separated by a comma"
      id="labelsInput"
    >
      <Input type="text" {...props} placeholder="label1,label2,...,labelN" />
    </FormField>
  );
};
