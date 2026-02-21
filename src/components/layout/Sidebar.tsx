import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Search, List, Bookmark, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Companies', to: '/companies', icon: Building2 },
  { label: 'Lists', to: '/lists', icon: List },
  { label: 'Saved Searches', to: '/saved', icon: Bookmark },
  { label: 'Settings', to: '/settings', icon: Settings },
];
export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 hover:cursor-pointer" onClick={()=>{navigate('/')}}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-semibold tracking-tight">ScoutFlow</span>
      </div>

      {/* Search hint */}
      <div className="mx-4 mb-4">
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-sm text-sidebar-muted">
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="ml-auto rounded bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-medium text-sidebar-muted">⌘K</kbd>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-foreground'
                  : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              {isActive && (
                <div className="absolute left-0 h-6 w-[3px] rounded-r-full bg-primary" />
              )}
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-muted">Precision AI Scout for VC</p>
      </div>
    </aside>
  );
}
