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
  throw Error(response.statusText);
}

type PokerSessionData = {
  repo_name: string;
  org_name?: string;
  labels?: string;
};

function createPokerSession(data: PokerSessionData, crsfToken: string) {
  const body = JSON.stringify(data);

  return fetch("/api/poker", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": crsfToken,
    },
    body,
  }).then(isResponseOk);
}

export type RecentPokerSession = {
  repoName: string;
  id: string;
};

function getMostRecentPokerSession() {
  return fetch("/api/recent")
    .then(isResponseOk)
    .then((data) => data.mostRecentSession);
}

export { getCSRF, getUserInfo, createPokerSession, getMostRecentPokerSession };
