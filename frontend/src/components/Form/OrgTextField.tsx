import { FormControl, FormLabel, InputProps } from "@chakra-ui/react";
import React from "react";
import { Input } from "./Input";

export const OrgTextField = ({ isDisabled, ...props }: InputProps) => {
  return (
    <FormControl isRequired id="orgInput">
      <FormLabel> Name of your Github Organization</FormLabel>
      <Input type="text" {...props} placeholder="type your org name here..." />
    </FormControl>
  );
};
