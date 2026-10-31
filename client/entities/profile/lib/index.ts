export const profileKeys = {
  all: ["profile"] as const,
};

// The time zone the browser is in, undefined where Intl can't tell
export const browserTimeZone = (): string | undefined => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};
