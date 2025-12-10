"use client";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import Title from "@/shared/components/title";
import Link from "next/link";
import { LuHouse } from "react-icons/lu";

export function NavFooter() {
  const { open } = useSidebar();

  if (!open) return null;

  return (
    <SidebarMenu>
      <SidebarSeparator />
      <SidebarMenuItem>
        <Link
          href="/"
          className="flex flex-row justify-center items-center hover:opacity-65 duration-200"
        >
          <LuHouse className="mr-2" />
          <Title text="Home page" />
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
