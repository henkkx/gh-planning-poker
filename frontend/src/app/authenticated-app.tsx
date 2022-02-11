import {
  chakra,
  Box,
  Center,
  Heading,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import * as React from "react";
import { User } from "../auth";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import { Navbar } from "../components/Navbar";
import { NavTabLink } from "../components/Navbar/NavTabLink";
import { UserProfile } from "../components/Navbar/UserProfile";
import { usePathname } from "../utils/hooks";
import AppRoutes from "./routes";

type Props = {
  user: User;
  logout: () => void;
};

function AuthenticatedApp({ user, logout }: Props) {
  const path = usePathname();
  const { name, username, avatarUrl } = user;

  return (
    <chakra.main>
      <Navbar>
        <Navbar.Brand>
          <Center marginEnd={6}>
            <Heading size="lg"> Github Poker </Heading>
          </Center>
        </Navbar.Brand>

        <Navbar.Links>
          <NavTabLink isActive={path === "/"} to="/">
            Home
          </NavTabLink>
          <NavTabLink isActive={path.startsWith("/play")} to="/play">
            Play
          </NavTabLink>
        </Navbar.Links>
        <Navbar.UserProfile>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
          <UserProfile
            avatarUrl={avatarUrl ?? "no_avatar_url_found"}
            name={name}
            username={username}
          />
          <ColorModeSwitcher />
        </Navbar.UserProfile>
      </Navbar>
      <Box
        as="section"
        bg={useColorModeValue("gray.50", "gray.800")}
        overflow="auto"
        minH="90vh"
      >
        <AppRoutes />
      </Box>
    </chakra.main>
  );
}

export default AuthenticatedApp;
