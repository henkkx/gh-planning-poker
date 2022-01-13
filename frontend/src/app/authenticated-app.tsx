import { Box, Center, Heading, useColorModeValue } from "@chakra-ui/react";
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
};

function AuthenticatedApp({ user }: Props) {
  const path = usePathname();
  const { name, email } = user;

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
          <NavTabLink isActive={path.startsWith("/play")} to="/play">
            Play
          </NavTabLink>
        </Navbar.Links>
        <Navbar.UserProfile>
          <UserProfile
            name={name}
            avatarUrl="avatar_url_for_user_profile"
            email={email}
          />
          <ColorModeSwitcher />
        </Navbar.UserProfile>
      </Navbar>
      <Box
        as="section"
        bg={useColorModeValue("gray.50", "gray.800")}
        overflow="hidden"
        minH="90vh"
      >
        <AppRoutes />
      </Box>
    </main>
  );
}

export default AuthenticatedApp;
