import {
  screen,
  waitFor,
  render,
  server,
  user,
  POKER_SESSION_ID,
} from "../../utils/test-utils";
import { CreateSessionView } from "../create-session";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  __esModule: true,
  useHistory: () => ({ push: mockPush }),
}));

describe("create-session screen", () => {
  it("should create a planning poker session", async () => {
    render(<CreateSessionView />);
    const REPO_NAME = "test-repository-name";
    const input = await screen.findByText(/name of your github repsitory/i);
    user.type(input, REPO_NAME);
    const submitButton = screen.getByText(/create a session/i);

    user.click(submitButton);

    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1));
    expect(mockPush).toHaveBeenCalledWith(`/play/${POKER_SESSION_ID}`);
  });

  it("should create a session for an organization repo", async () => {
    render(<CreateSessionView />);
    const REPO_NAME = "test-repository-name";
    const ORG_NAME = "Kaiba Corp";

    const repoInput = await screen.findByText(/name of your github repsitory/i);
    user.type(repoInput, REPO_NAME);

    const toggle = screen.getByLabelText(
      /the repository belongs to an organization/i
    );
    user.click(toggle);

    const orgNameInput = await screen.findByText(
      /name of your github organization/i
    );
    user.type(orgNameInput, ORG_NAME);

    const submitButton = screen.getByText(/create a session/i);

    user.click(submitButton);

    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1));
    expect(mockPush).toHaveBeenCalledWith(`/play/${POKER_SESSION_ID}`);
  });
});
