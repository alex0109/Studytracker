import { SquareTerminal, BookOpen, Settings2 } from "lucide-react";
import {
  LuBookOpen,
  LuCalendarCheck,
  LuCalendarDays,
  LuChartColumn,
  LuGauge,
  LuHouse,
  LuLibrary,
  LuLogIn,
} from "react-icons/lu";

// Names are translation keys under "nav"
export const links = [
  { name: "home", hash: "/home", icon: LuHouse },
  { name: "library", hash: "/library", icon: LuLibrary },
  { name: "auth", hash: "/sign-in", icon: LuLogIn },
] as const;

export const authorizedLinks = [
  { name: "today", hash: "/app", icon: LuCalendarCheck },
  { name: "materials", hash: "/materials", icon: LuBookOpen },
  { name: "library", hash: "/library", icon: LuLibrary },
  { name: "statistics", hash: "/statistics", icon: LuChartColumn },
  { name: "calendar", hash: "/calendar", icon: LuCalendarDays },
  { name: "limits", hash: "/limits", icon: LuGauge },
] as const;

export const adminNavLinks = [
  {
    title: "Statistics",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "Materials",
        url: "/admin/materials",
      },
      {
        title: "Users",
        url: "/admin/users",
      },
      {
        title: "Traffic",
        url: "/admin/traffic",
      },
    ],
  },
  {
    title: "Documentation",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Documentation",
        url: "/admin/docs",
      },
      {
        title: "Plans",
        url: "/admin/plans",
      },
      {
        title: "Changelog",
        url: "/admin/changelog",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "General",
        url: "#",
      },
      {
        title: "Billing",
        url: "#",
      },
      {
        title: "Sign out",
        url: "#",
      },
    ],
  },
];
