function getCSRF() {
  fetch("/api/csrf/", {
    credentials: "same-origin",
  })
    .then((res) => res.headers.get("X-CSRFToken"))
    .catch(console.log);
}

function getUserInfo() {
  return fetch("/users/me/", {
    credentials: "same-origin",
  })
    .then(isResponseOk)
    .catch(console.log);
}

function isResponseOk(response: Response) {
  if (response.status >= 200 && response.status <= 299) {
    return response.json();
  } else {
    throw Error(response.statusText);
  }
}

export { getCSRF, getUserInfo };
