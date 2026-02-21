import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { GlobalSearch } from "./GlobalSearch";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block md:w-60">
          <Sidebar />
        </div>

        {/* Main Section */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="glass-header sticky top-0 z-30 flex h-14 items-center px-4 md:px-6">
            <GlobalSearch />
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}