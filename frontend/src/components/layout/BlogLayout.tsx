import { Outlet } from "react-router-dom";
import { Layers } from "lucide-react";
import Navbar from "./Navbar";
import MobileTabBar from "./MobileTabBar";

export default function BlogLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-navy-100 bg-white pb-24 sm:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-navy-900 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="text-sm font-bold text-navy-900">
                YarnHam
              </span>
            </div>
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
