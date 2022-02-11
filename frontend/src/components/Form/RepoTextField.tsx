import { InputProps } from "@chakra-ui/react";
import { FormField } from "./FormField";
import { Input } from "./Input";

export const RepoTextField = (props: InputProps) => {
  return (
    <FormField
      labelText="Name of your Github Repsitory"
      isRequired
      id="repoInput"
    >
      <Input type="text" {...props} placeholder="super-cool-repo-1" />
    </FormField>
  );
};
