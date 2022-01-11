import type { User } from "../auth";

function getCSRF() {
  return fetch("/api/csrf").then((res) =>
    res.headers.get("X-CSRFToken")
  ) as Promise<string>;
}

function getUserInfo(): Promise<User> {
  return fetch("/api/users/me")
    .then(isResponseOk)
    .catch(() => {
      console.log("must login first");
    });
}

function isResponseOk(response: Response) {
  if (200 <= response.status && response.status <= 299) {
    return response.json();
  }
  console.log(response);

  throw Error(response.statusText);
}

type PokerSessionData = { repo_name: string; org_name?: string };
function createPokerSession(data: PokerSessionData, crsfToken: string) {
  return fetch("/api/poker", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": crsfToken,
    },
    body: JSON.stringify(data),
  }).then(isResponseOk);
}

export { getCSRF, getUserInfo, createPokerSession };
