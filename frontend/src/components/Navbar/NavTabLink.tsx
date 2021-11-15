import {
  Link,
  LinkProps,
  chakra,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

type RouterLinkProps = LinkProps & { to: string; isActive: boolean };

export const NavTabLink: React.FC<RouterLinkProps> = ({
  to,
  isActive,
  ...rest
}) => {
  return (
    <chakra.a
      _activeLink={{
        color: mode("blue.600", "blue.300"),
        fontWeight: "bold",
      }}
      _focus={{ shadow: "none" }}
      fontSize={{ base: 20, md: 18 }}
      aria-current={isActive ? "page" : undefined}
      px={{ base: 6, md: 4 }}
      as={RouterLink}
      mt={{ md: 0, sm: 10 }}
      to={to}
      _hover={{ color: mode("blue.600", "blue.200") }}
      {...rest}
    />
  );
};
