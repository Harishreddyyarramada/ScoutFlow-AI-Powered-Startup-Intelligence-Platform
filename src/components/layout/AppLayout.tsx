import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { GlobalSearch } from "./GlobalSearch";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col w-full lg:pl-64">

        {/* Search Bar */}
        <div className="sticky top-14 z-30 glass-header flex h-14 items-center px-4 md:px-6 border-b border-border">
          <GlobalSearch />
        </div>

        {/* Main Content */}
        <main className="flex-1 pt-6 px-4 md:px-6 lg:px-10 pb-10">
          <Outlet />
        </main>

      </div>
    </div>
  );
}