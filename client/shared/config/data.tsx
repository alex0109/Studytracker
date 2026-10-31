import { SquareTerminal, BookOpen, Settings2 } from "lucide-react";

// Names are translation keys under "nav"
export const links = [
  { name: "home", hash: "/" },
  { name: "auth", hash: "/sign-in" },
] as const;

export const authorizedLinks = [
  { name: "home", hash: "/" },
  { name: "today", hash: "/today" },
  { name: "materials", hash: "/materials" },
  { name: "library", hash: "/library" },
  { name: "statistics", hash: "/statistics" },
  { name: "limits", hash: "/limits" },
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
