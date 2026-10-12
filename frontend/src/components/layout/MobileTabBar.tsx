import { House, SquarePlus, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function MobileTabBar() {
  const { pathname } = useLocation();

  const tabs = [
    {
      to: "/blog",
      label: "Feeds",
      active:
        pathname.startsWith("/blog") && !pathname.startsWith("/blog/create"),
      icon: House,
    },
    {
      to: "/blog/create",
      label: "Create",
      active: pathname.startsWith("/blog/create"),
      icon: SquarePlus,
    },
    {
      to: "/account",
      label: "Profile",
      active: pathname.startsWith("/account"),
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-white border-t border-navy-200 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              aria-current={tab.active ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                tab.active ? "text-navy-900" : "text-navy-400"
              }`}
            >
              {tab.active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-brand-500" />
              )}
              <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
