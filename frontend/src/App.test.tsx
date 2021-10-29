import React from "react";
import { screen } from "@testing-library/react";
import { render } from "./test-utils";
import { App } from "./App";

test("renders", () => {
  render(<App />);
  const msg = screen.getByText(/sign in/i);
  expect(msg).toBeInTheDocument();
});
