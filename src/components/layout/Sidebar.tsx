import { NavLink, useLocation ,useNavigate} from "react-router-dom";
import {
  Building2,
  List,
  Bookmark,
  Settings,
  Zap,
  Home,
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6">
        
        {/* Logo + Mobile Menu */}
        <div className="flex items-center gap-3" >
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 font-semibold" onClick={()=>navigate("/")} style={{cursor: "pointer"}}>
            <Zap className="h-5 w-5 text-primary" />
            ScoutFlow
          </div>
        </div>

        <div />
      </header>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 flex-col
  bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
  border-r border-white/5
  shadow-[inset_-1px_0_0_rgba(255,255,255,0.04)]
"> 
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
  isActive
    ? "bg-white/10 text-white"
    : "text-slate-400 hover:bg-white/5 hover:text-white"
)} 
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-primary" />
                )}

                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          ScoutFlow AI Intelligence
        </div>
      </aside>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <aside className="fixed top-0 left-0 h-full w-64 bg-background z-50 shadow-xl border-r border-border p-4 space-y-4 lg:hidden animate-in slide-in-from-left duration-300">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Zap className="h-5 w-5 text-primary" />
                ScoutFlow
              </div>

              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.to;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
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
          </aside>
        </>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-14" />
    </>
  );
}