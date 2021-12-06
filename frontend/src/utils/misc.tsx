export function redirect(url: string, params?: URLSearchParams) {
  window.location.href = params ? `${url}?${params}` : url;
}

export const refreshPage = () => window.location.reload();
