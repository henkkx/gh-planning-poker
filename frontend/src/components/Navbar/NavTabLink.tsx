import {
  Link,
  LinkProps,
  Tab,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";

export const NavTabLink: React.FC<LinkProps> = (props) => {
  return (
    <Tab
      _selected={{ color: mode("blue.600", "blue.200") }}
      _focus={{ shadow: "none" }}
      justifyContent="flex-start"
      px={{ base: 4, md: 6 }}
    >
      <Link
        as="div"
        display="block"
        fontWeight="medium"
        lineHeight="1.25rem"
        color="inherit"
        _hover={{ color: mode("blue.600", "blue.200") }}
        _activeLink={{
          color: mode("blue.600", "blue.200"),
        }}
        {...props}
      />
    </Tab>
  );
};
