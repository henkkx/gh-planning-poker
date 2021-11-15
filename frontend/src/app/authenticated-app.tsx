import { Box, Center, Heading, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useAuth } from "../auth";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import { Navbar } from "../components/Navbar";
import { NavTabLink } from "../components/Navbar/NavTabLink";
import { UserProfile } from "../components/Navbar/UserProfile";
import { FullPageProgress } from "../components/Spinner";
import { usePathname } from "../utils/hooks";
import AppRoutes from "./routes";

function AuthenticatedApp() {
  const { user, logout } = useAuth();
  const path = usePathname();
  const mode = useColorModeValue("gray.50", "gray.800");

  return (
    <main>
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
          <NavTabLink isActive={path === "/play"} to="/play">
            Play
          </NavTabLink>
        </Navbar.Links>
        <Navbar.UserProfile>
          <UserProfile
            name={user!.name}
            avatarUrl="avatar_url_for_user_profile"
            email={user!.email}
          />
          <ColorModeSwitcher />
        </Navbar.UserProfile>
      </Navbar>
      <Box as="section" bg={mode} overflow="hidden" minH="100vh">
        <AppRoutes />
      </Box>
    </main>
  );
}

export default AuthenticatedApp;
