import * as React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, RenderOptions } from "@testing-library/react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../auth";

type PostBody = {
  repo_name: string;
  org_name?: string;
};

export const POKER_SESSION_ID = 42;

const server = setupServer(
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

  rest.post<PostBody>("/api/poker", (req, res, ctx) => {
    const { repo_name, org_name } = req.body;
    return res(
      ctx.json({
        id: POKER_SESSION_ID,
        current_task: 1,
        repo_name,
        org_name,
      })
    );
  })
);

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
export { customRender as render, server, user };
