import React from "react";
import { render, screen, waitFor } from "../../utils/test-utils";
import { App } from "../app";

test("renders", async () => {
  render(<App />);
});
