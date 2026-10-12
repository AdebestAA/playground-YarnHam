import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import MobileTabBar from "./MobileTabBar";
import Logo from "../ui/Logo";

export default function BlogLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-navy-200 pb-24 sm:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-xs text-navy-400">
              &copy; {new Date().getFullYear()} YarnHam. Built on PostgreSQL, Express &amp; Redis.
            </p>
          </div>
        </div>
      </footer>
      <MobileTabBar />
    </div>
  );
}
