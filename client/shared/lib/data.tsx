import { SquareTerminal, BookOpen, Settings2 } from "lucide-react";

export const links = [
  {
    name: "Home",
    hash: "/",
  },
  {
    name: "Auth",
    hash: "/sign-in",
  },
];

export const authorizedLinks = [
  {
    name: "Home",
    hash: "/",
  },
  {
    name: "Materials",
    hash: "/materials",
  },
  {
    name: "Stats",
    hash: "/stats",
  },
];

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
        title: "Introduction",
        url: "#",
      },
      {
        title: "Plans",
        url: "#",
      },
      {
        title: "Changelog",
        url: "#",
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
