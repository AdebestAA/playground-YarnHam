import { Link, useLocation } from "react-router-dom";
import { Layers } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useLogout } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useAccount";
import { getInitial, getUsernameFromEmail } from "../../helpers";
import Button from "../ui/Button";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  const isAuthenticated = !!user;
  const { data: profile } = useProfile(isAuthenticated);

  return (
    <nav className="sticky top-0 z-50 glass-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-navy-950 flex items-center justify-center transition-colors group-hover:bg-navy-800">
              <Layers className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="hidden min-[460px]:block text-xl font-bold text-navy-900 tracking-tight">
              YarnHam
            </span>
          </Link>

          {!isAuthPage && (
            <div className="hidden sm:flex items-center gap-1">
              {isAuthenticated && (
                <>
                  <Link
                    to="/blog"
                    className="px-4 py-2 rounded-full text-sm font-semibold text-navy-700 hover:bg-white/80 hover:shadow-sm transition-all"
                  >
                    Feeds
                  </Link>
                  <Link
                    to="/blog/create"
                    className="px-4 py-2 rounded-full text-sm font-semibold text-navy-700 hover:bg-white/80 hover:shadow-sm transition-all"
                  >
                    Post
                  </Link>
                  <Link
                    to="/account"
                    className="px-4 py-2 rounded-full text-sm font-semibold text-navy-700 hover:bg-white/80 hover:shadow-sm transition-all"
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            {!isAuthPage && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/account"
                      className="flex items-center gap-2 group"
                      title="Your profile"
                    >
                      {profile?.avatar ? (
                        <img
                          src={profile.avatar}
                          alt="Your avatar"
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-md"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-navy-950 flex items-center justify-center text-white text-xs font-bold">
                          {getInitial(user?.email)}
                        </div>
                      )}
                      <span className="hidden sm:block text-sm font-semibold text-navy-700 group-hover:text-navy-900 transition-colors">
                        {profile?.nickname || getUsernameFromEmail(user?.email)}
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => logout.mutate()}
                      isLoading={logout.isPending}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/auth/login">
                      <Button variant="ghost" size="sm">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/auth/register">
                      <Button variant="primary" size="sm">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
