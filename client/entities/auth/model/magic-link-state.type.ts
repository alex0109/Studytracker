export type MagicLinkStateType =
  | { error: string; success?: undefined }
  | { success: string; error?: undefined }
  | { error?: undefined; success?: undefined };
