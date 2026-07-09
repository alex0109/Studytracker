"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/shared/radix-ui/Sidebar/sidebar";
import { Title } from "@/shared/ui";
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
