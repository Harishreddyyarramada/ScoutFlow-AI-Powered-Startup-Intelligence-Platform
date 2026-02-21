import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  List,
  Bookmark,
  Settings,
  Zap,
  Home,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", to: "/", icon: Home },
  { label: "Companies", to: "/companies", icon: Building2 },
  { label: "Lists", to: "/lists", icon: List },
  { label: "Saved Searches", to: "/saved", icon: Bookmark },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6">
        
        {/* Left */}
        <button
          onClick={toggleMenu}
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition"
        >
          <Zap className="h-4 w-4 text-primary" />
          ScoutFlow
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>

        {/* Right (optional future area) */}
        <div />
      </header>

      {/* ================= COLLAPSIBLE MENU ================= */}
      <div
        className={cn(
          "fixed top-14 left-0 right-0 z-40 bg-background border-b border-border overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="px-6 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Spacer to avoid content hiding under navbar */}
      <div className="h-14" />
    </>
  );
}