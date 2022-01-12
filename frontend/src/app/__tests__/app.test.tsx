import {
  render,
  screen,
  waitFor,
  setupServer,
  defaultHandlers,
  rest,
} from "../../test/utils";
import { App } from "../app";

const server = setupServer(...defaultHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// github actions started mysteriously timing out recently
// this fixes it for now
jest.setTimeout(30000);

describe("the app", () => {
  it("renders authenticated content if user is authenticated", async () => {
    render(<App />);
    await screen.findByText(/welcome firstname lastname/i);
  });

  it("renders unauthenticated content if user is not authenticated", async () => {
    server.use(
      rest.get("/api/users/me", (req, res, ctx) => {
        return res(ctx.status(403));
      })
    );
    render(<App />);
    const userGreeting = await waitFor(() =>
      screen.queryByText(/welcome firstname lastname/i)
    );

    expect(userGreeting).not.toBeInTheDocument();
    const genericGreeting = await screen.findByText(/online planning poker/i);
    expect(genericGreeting).toBeInTheDocument();
  });
});
