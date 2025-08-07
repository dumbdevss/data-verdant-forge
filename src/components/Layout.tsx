import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background animated-grid">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-50 h-16 flex items-center border-b border-border/50 glass-card">
            <SidebarTrigger className="ml-4" />
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;