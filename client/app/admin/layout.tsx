"use client";

import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "./(components)/sidebar/sidebar.component";
import { useSession } from "@/shared/context/session-provider.context";
import { redirect } from "next/navigation";

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { user } = useSession();
  if (!user) redirect("/sign-in");
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col items-center w-[100vw]">{children}</main>
    </SidebarProvider>
  );
};

export default AdminLayout;
