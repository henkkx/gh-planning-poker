export function redirect(url: string, params?: URLSearchParams) {
  window.location.href = params ? `${url}?${params}` : url;
}

export const refreshPage = () => window.location.reload();

export const copyToClipboard = (text: string) =>
  navigator.clipboard.writeText(text);

export const copyLinkToGameToClipboard = () =>
  copyToClipboard(window.location.href);
