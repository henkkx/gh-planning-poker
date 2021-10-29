function getCSRF() {
  fetch("/api/csrf/", {
    credentials: "same-origin",
  })
    .then((res) => res.headers.get("X-CSRFToken"))
    .catch(console.log);
}

function getIsAuthenticated() {
  const response = fetch("/api/session/", {
    credentials: "same-origin",
  })
    .then((res) => res.json())
    .then((data) => data.isAuthenticated)
    .catch(console.log);

  return Boolean(response);
}

export { getCSRF, getIsAuthenticated };
