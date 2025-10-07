"use client";

import * as React from "react";
import { BookOpen, Settings2, SquareTerminal } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/shared/components/ui/sidebar";
import { NavHeader } from "./components/nav-header.component";
import { NavMain } from "./components/nav-main.component";
import { NavFooter } from "./components/nav-footer.component";

const data = {
  navMain: [
    {
      title: "Statistics",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Materials",
          url: "#",
        },
        {
          title: "Users",
          url: "#",
        },
        {
          title: "Traffic",
          url: "#",
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
