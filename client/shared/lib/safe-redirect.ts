// Only same-site paths are allowed after sign in, so the link can't send users elsewhere.
// "//evil.com" and "/\evil.com" are protocol-relative for browsers, control characters can hide them
export const getSafeRedirect = (path: string | null | undefined): string =>
  path &&
  path.startsWith("/") &&
  !path.startsWith("//") &&
  !/[\\\u0000-\u001f\u007f]/.test(path)
    ? path
    : "/";
