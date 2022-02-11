import { InputProps } from "@chakra-ui/react";
import { FormField } from "./FormField";
import { Input } from "./Input";

export const OrgTextField = ({ isDisabled, ...props }: InputProps) => {
  return (
    <FormField
      isRequired
      id="orgInput"
      labelText="Name of your Github Organization"
    >
      <Input type="text" {...props} placeholder="type your org name here..." />
    </FormField>
  );
};
