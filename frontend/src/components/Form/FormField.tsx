import React from "react";
import { FormControl, FormLabel, FormControlProps } from "@chakra-ui/react";

type Props = {
  labelText: string;
} & FormControlProps;

export const FormField: React.FC<Props> = ({
  labelText,
  children,
  ...formControlProps
}) => {
  return (
    <FormControl {...formControlProps}>
      <FormLabel> {labelText} </FormLabel>
      {children}
    </FormControl>
  );
};
