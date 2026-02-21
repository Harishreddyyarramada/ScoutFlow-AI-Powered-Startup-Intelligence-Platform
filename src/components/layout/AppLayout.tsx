import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar"; // this is now Navbar
import { GlobalSearch } from "./GlobalSearch";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      
      {/* Navbar */}
      <Sidebar />

      {/* Top Search Bar (Below Navbar) */}
      <div className="sticky top-14 z-30 glass-header flex h-14 items-center px-4 md:px-6">
        <GlobalSearch />
      </div>

      {/* Main Content */}
      <main className="pt-4 px-4 md:px-6 lg:px-8 pb-8">
        <Outlet />
      </main>
    </div>
  );
}