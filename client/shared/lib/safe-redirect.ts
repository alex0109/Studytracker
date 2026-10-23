// Only same-site paths are allowed after sign in, so the link can't send users elsewhere
export const getSafeRedirect = (path: string | null | undefined): string =>
  path && path.startsWith("/") && !path.startsWith("//") ? path : "/";
