import { Switch, SwitchProps } from "@chakra-ui/react";
import { FormField } from "./FormField";

export function OrgRepoSwitch({ onChange }: SwitchProps) {
  return (
    <FormField
      labelText="The repository belongs to an organization"
      display="flex"
      id="orgSwitch"
      alignItems="center"
    >
      <Switch id="orgSwitch" onChange={onChange} />
    </FormField>
  );
}
