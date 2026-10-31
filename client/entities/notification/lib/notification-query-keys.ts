export const notificationKeys = {
  all: ["notifications"] as const,

  feed: () => [...notificationKeys.all, "feed"] as const,

  settings: () => [...notificationKeys.all, "settings"] as const,
};
