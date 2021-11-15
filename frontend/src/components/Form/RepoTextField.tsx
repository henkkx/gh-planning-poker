import { FormControl, FormLabel, InputProps } from "@chakra-ui/react";
import React from "react";
import { Input } from "./Input";

export const RepoTextField = (props: InputProps) => {
  return (
    <FormControl isRequired id="repoInput">
      <FormLabel>Name of your Github Repsitory</FormLabel>
      <Input type="text" {...props} placeholder="super-cool-repo-1" />
    </FormControl>
  );
};
