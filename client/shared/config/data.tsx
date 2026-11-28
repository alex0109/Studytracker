import {
  LuBookOpen,
  LuCalendarCheck,
  LuChartColumn,
  LuCompass,
  LuGauge,
  LuHouse,
  LuLibrary,
  LuLogIn,
} from "react-icons/lu";

// Names are translation keys under "nav"
export const links = [
  { name: "home", hash: "/home", icon: LuHouse },
  { name: "guide", hash: "/guide", icon: LuCompass },
  { name: "library", hash: "/library", icon: LuLibrary },
  { name: "auth", hash: "/sign-in", icon: LuLogIn },
] as const;

export const authorizedLinks = [
  { name: "today", hash: "/app", icon: LuCalendarCheck },
  { name: "materials", hash: "/materials", icon: LuBookOpen },
  { name: "library", hash: "/library", icon: LuLibrary },
  { name: "statistics", hash: "/statistics", icon: LuChartColumn },
  // "Plan" on screen: what the user pays for and what it includes
  { name: "limits", hash: "/limits", icon: LuGauge },
  { name: "guide", hash: "/guide", icon: LuCompass },
] as const;

