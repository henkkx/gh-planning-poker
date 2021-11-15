import { FormControl, FormLabel, Switch, SwitchProps } from "@chakra-ui/react";
import React from "react";

export function OrgRepoSwitch({ onChange }: SwitchProps) {
  return (
    <FormControl display="flex" id="orgSwitch" alignItems="center">
      <FormLabel mb="0">The repository belongs to an organization</FormLabel>
      <Switch onChange={onChange} />
    </FormControl>
  );
}
