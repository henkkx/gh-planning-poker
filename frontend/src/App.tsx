import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Button,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import * as api from "./api";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Login from "./screens/login/Login";
import { Navbar } from "./components/Navbar";
import { NavTabLink } from "./components/Navbar/NavTabLink";
import { UserProfile } from "./components/Navbar/UserProfile";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
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
      <Login />
    </ChakraProvider>
  );
};
