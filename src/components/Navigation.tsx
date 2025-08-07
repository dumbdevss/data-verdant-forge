import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database, Wallet, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Explore", icon: Search },
    { href: "/my-datasets", label: "My Datasets", icon: Database },
    { href: "/create", label: "Create Dataset", icon: Plus },
  ];

  return (
    <nav className="glass-card border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Database className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              DataMarket
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth text-sm font-medium",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Button */}
          <Button
            variant="wallet"
            size="lg"
            onClick={() => setIsWalletConnected(!isWalletConnected)}
            className="flex items-center space-x-2"
          >
            <Wallet className="w-4 h-4" />
            <span>{isWalletConnected ? "0x1234...5678" : "Connect Wallet"}</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;