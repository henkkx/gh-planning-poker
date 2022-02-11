import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../auth/auth-provider";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

const AppProviders: React.FC = ({ children }) => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  </ChakraProvider>
);

export default AppProviders;
