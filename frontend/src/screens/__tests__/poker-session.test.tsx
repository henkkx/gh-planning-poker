import { render } from "../../test/utils";
import Poker from "../poker-session";

describe("the poker session view", () => {
  it("renders", async () => {
    render(<Poker />);
  });
});
