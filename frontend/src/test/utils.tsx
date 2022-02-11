import * as React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render as defaultRender, RenderOptions } from "@testing-library/react";
import user from "@testing-library/user-event";
import AppProviders from "../utils/providers";

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

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  defaultRender(ui, { wrapper: AppProviders, ...options });

export * from "@testing-library/react";
export { customRender as render, setupServer, rest, defaultHandlers, user };
