import { ReactNode, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background animated-grid">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-50 h-16 flex items-center justify-between border-b border-border/50 glass-card px-4">
            <SidebarTrigger />
            <Button
              variant="wallet"
              size="lg"
              onClick={() => setIsWalletConnected(!isWalletConnected)}
              className="h-10"
            >
              <Wallet className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                {isWalletConnected ? "0x1234...5678" : "Connect Wallet"}
              </span>
            </Button>
          </header>
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;