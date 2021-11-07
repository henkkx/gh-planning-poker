import { redirect } from "../utils/misc";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID ?? "no_client_id_set";
const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";

function createGithubUrlParams() {
  const scope = ["user", "repo"].join(" ");

  const params = {
    response_type: "code",
    client_id: CLIENT_ID,
    scope,
  };
  return new URLSearchParams(params);
}

function openGithubLoginPage() {
  const params = createGithubUrlParams();
  redirect(GITHUB_AUTH_URL, params);
}

export { openGithubLoginPage };
