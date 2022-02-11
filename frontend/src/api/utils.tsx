export function isResponseOk(response: Response) {
  if (200 <= response.status && response.status <= 299) {
    return response.json();
  }
  throw Error(response.statusText);
}
