import React from "react";
import { screen } from "@testing-library/react";
import { render } from "./test-utils";
import { App } from "./App";

test("renders greeting", () => {
  render(<App />);
  const greeting = screen.getByText(/hello world/i);
  expect(greeting).toBeInTheDocument();
});
