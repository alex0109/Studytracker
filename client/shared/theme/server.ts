import { cookies } from "next/headers";
import { resolveTheme, THEME_COOKIE } from "./config";

export const getServerTheme = async () =>
  resolveTheme((await cookies()).get(THEME_COOKIE)?.value);
