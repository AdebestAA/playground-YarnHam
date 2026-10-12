import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useLogout } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useAccount";
import { getUsernameFromEmail } from "../../helpers";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import Logo from "../ui/Logo";

const NAV_LINKS = [
  { to: "/blog", label: "Feed", match: (p: string) => p.startsWith("/blog") && !p.startsWith("/blog/create") },
  { to: "/blog/create", label: "Write", match: (p: string) => p.startsWith("/blog/create") },
  { to: "/account", label: "Profile", match: (p: string) => p.startsWith("/account") },
];

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { pathname } = useLocation();
  const isAuthPage = pathname.startsWith("/auth");
  const isAuthenticated = !!user;
  const { data: profile } = useProfile(isAuthenticated);
  const displayName = profile?.nickname || getUsernameFromEmail(user?.email);

  return (
    <nav className="sticky top-0 z-50 glass-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo hideWordmarkOnMobile />

          {!isAuthPage && isAuthenticated && (
            <div className="hidden sm:flex items-center gap-1 rounded-full bg-navy-100/70 p-1">
              {NAV_LINKS.map((link) => {
                const active = link.match(pathname);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      active
                        ? "bg-white text-navy-950 shadow-sm"
                        : "text-navy-500 hover:text-navy-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          {!isAuthPage && (
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1 sm:pr-3 hover:bg-navy-100 transition-colors"
                    title="Your profile"
                  >
                    <Avatar
                      name={displayName}
                      src={profile?.avatar}
                      size="sm"
                    />
                    <span className="hidden sm:block text-sm font-medium text-navy-700 max-w-[140px] truncate">
                      {displayName}
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => logout.mutate()}
                    isLoading={logout.isPending}
                    aria-label="Sign out"
                    title="Sign out"
                    className="!px-2.5"
                  >
                    {!logout.isPending && (
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth/login">
                    <Button variant="ghost" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button variant="primary" size="sm">
                      Start writing
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
