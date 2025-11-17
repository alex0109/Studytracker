"use client";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import Title from "@/shared/components/title";

export function NavFooter() {
  const { open } = useSidebar();

  if (!open) return null;

  return (
    <SidebarMenu>
      <SidebarSeparator />
      <SidebarMenuItem>
        <Title text="Footer" />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
