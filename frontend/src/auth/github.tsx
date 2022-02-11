import { redirect } from "../utils/misc";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || "no_client_id_set";
const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";

type Options = {
  state?: string;
};

function createGithubUrlParams(options: Options) {
  const scope = ["read:user", "repo"].join(" ");
  const params = {
    response_type: "code",
    client_id: CLIENT_ID,
    scope,
    ...options,
  };
  return new URLSearchParams(params);
}

function openGithubLoginPage(options: Options = {}) {
  const params = createGithubUrlParams(options);
  redirect(GITHUB_AUTH_URL, params);
}

export { openGithubLoginPage };
