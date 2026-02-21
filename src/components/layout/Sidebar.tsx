import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Search, List, Bookmark, Settings, Zap, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { label: 'Companies', to: '/companies', icon: Building2 },
  { label: 'Lists', to: '/lists', icon: List },
  { label: 'Saved Searches', to: '/saved', icon: Bookmark },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (to: string) => {
    navigate(to);
    setMobileOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Visible on small screens */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-sidebar border-b border-sidebar-border px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight text-sidebar-foreground">ScoutFlow</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-sidebar-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-sidebar-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Desktop Sidebar - Always visible on larger screens */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out',
          'hidden md:flex',
          mobileOpen && 'translate-x-0'
        )}
      >
        {/* Logo */}
        <div
          className="flex h-16 items-center gap-2.5 px-5 hover:cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => handleNavClick('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNavClick('/')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight">ScoutFlow</span>
        </div>

        {/* Search hint */}
        <div className="mx-4 mb-4">
          <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-sm text-sidebar-muted">
            <Search className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Search</span>
            <kbd className="ml-auto rounded bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-medium text-sidebar-muted flex-shrink-0">⌘K</kbd>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-foreground'
                    : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 h-6 w-[3px] rounded-r-full bg-primary" />
                )}
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-muted">Precision AI Scout for VC</p>
        </div>
      </aside>

      {/* Mobile Navigation - Visible only on mobile */}
      <div
        className={cn(
          'fixed left-0 top-16 z-40 w-full bg-sidebar text-sidebar-foreground border-b border-sidebar-border flex flex-col md:hidden transition-all duration-300 ease-in-out overflow-hidden',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        {/* Search hint - Mobile */}
        <div className="mx-3 my-3">
          <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-sm text-sidebar-muted">
            <Search className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Search</span>
            <kbd className="ml-auto rounded bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-medium text-sidebar-muted flex-shrink-0">⌘K</kbd>
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="space-y-1 px-3 pb-4 overflow-y-auto max-h-64">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={`m-${item.to}`}
                to={item.to}
                onClick={closeMobileMenu}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-foreground'
                    : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 h-6 w-[3px] rounded-r-full bg-primary" />
                )}
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Footer */}
        <div className="border-t border-sidebar-border p-4 mt-auto">
          <p className="text-xs text-sidebar-muted">Precision AI Scout for VC</p>
        </div>
      </div>
    </>
  );
}