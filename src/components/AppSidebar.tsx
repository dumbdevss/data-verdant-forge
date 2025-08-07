import { Database, Search, Plus, Wallet } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Explore", url: "/", icon: Search },
  { title: "My Datasets", url: "/my-datasets", icon: Database },
  { title: "Create Dataset", url: "/create", icon: Plus },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/20 text-primary font-medium border-primary/30" : "hover:bg-accent/50";

  return (
    <Sidebar
      className={isCollapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Database className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              DataMarket
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) =>
                        `flex items-center space-x-3 p-3 rounded-lg transition-smooth border ${getNavCls({ isActive })}`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button
            variant="wallet"
            size={isCollapsed ? "icon" : "lg"}
            onClick={() => setIsWalletConnected(!isWalletConnected)}
            className={`w-full ${isCollapsed ? "h-10" : "h-12"}`}
          >
            <Wallet className="w-4 h-4" />
            {!isCollapsed && (
              <span className="ml-2">
                {isWalletConnected ? "0x1234...5678" : "Connect Wallet"}
              </span>
            )}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}