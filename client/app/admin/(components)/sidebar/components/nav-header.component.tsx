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
import Link from "next/link";

export function NavHeader() {
  const { open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex flex-col justify-center items-center">
        <SidebarTrigger />
        <SidebarSeparator />
        <Link href="/admin" className="hover:opacity-65 duration-200">
          <Title text={open ? "Studytracker" : "ST"} />
        </Link>
        <SidebarSeparator />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
