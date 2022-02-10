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

describe("the app", () => {
  it("renders authenticated content if user is authenticated", async () => {
    render(<App />);
    await screen.findByText(/welcome firstname lastname/i);
  });

  it("renders login screen if user is not authenticated", async () => {
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
    const loginBtn = await screen.findByText(/login with github/i);
    expect(loginBtn).toBeInTheDocument();
  });
});
