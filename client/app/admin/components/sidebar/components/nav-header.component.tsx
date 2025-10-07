"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import Title from "@/shared/components/title";

export function NavHeader() {
  const { open } = useSidebar();

  // if (!open) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex flex-col justify-center items-center">
        <SidebarTrigger />
        <SidebarSeparator />
        <Title text={open ? "Studytracker" : "ST"} />
        <SidebarSeparator />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
