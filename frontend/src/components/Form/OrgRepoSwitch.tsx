import { FormControl, FormLabel, Switch, SwitchProps } from "@chakra-ui/react";

export function OrgRepoSwitch({ onChange }: SwitchProps) {
  return (
    <FormControl display="flex" id="orgSwitch" alignItems="center">
      <FormLabel mb="0">The repository belongs to an organization</FormLabel>
      <Switch id="orgSwitch" onChange={onChange} />
    </FormControl>
  );
}
