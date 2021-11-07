import { Center } from "@chakra-ui/react";
import * as React from "react";
import { useAuth } from "./auth";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Navbar } from "./components/Navbar";
import { NavTabLink } from "./components/Navbar/NavTabLink";
import { UserProfile } from "./components/Navbar/UserProfile";
import { FullPageProgress } from "./components/Spinner";
import AppRoutes from "./routes";

function AuthenticatedApp() {
  const { user, logout } = useAuth();
  return (
    <main>
      <Navbar>
        <Navbar.Brand>
          <Center marginEnd={6}>Planning Poker</Center>
        </Navbar.Brand>

        <Navbar.Links>
          <NavTabLink>About</NavTabLink>
          <NavTabLink>Play</NavTabLink>
        </Navbar.Links>
        <Navbar.UserProfile>
          <UserProfile
            name="user"
            avatarUrl="avatar_url_for_user_profile"
            email="mail@test.com"
          />
          <ColorModeSwitcher />
        </Navbar.UserProfile>
      </Navbar>
      <AppRoutes />
    </main>
  );
}

export default AuthenticatedApp;
