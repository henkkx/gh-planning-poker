import * as React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, RenderOptions } from "@testing-library/react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../auth";

const defaultHandlers = [
  rest.get("/api/csrf", (req, res, ctx) => {
    return res(ctx.json({ detail: "crsf token set" }));
  }),

  rest.get("/api/users/me", (req, res, ctx) => {
    return res(
      ctx.json({
        name: "Firstname Lastname",
        email: "user@email.com",
        isAuthenticated: true,
      })
    );
  }),
];

const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  </ChakraProvider>
);

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
import user from "@testing-library/user-event";
export { customRender as render, setupServer, rest, defaultHandlers, user };
