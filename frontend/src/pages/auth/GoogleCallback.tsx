import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useGoogleAuth } from "../../hooks/useAuth";
import AuthLayout from "../../components/layout/AuthLayout";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const googleAuth = useGoogleAuth();

  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const fail = (message: string) => {
      toast.error(message);
      navigate("/auth/login", { replace: true });
    };

    const error = searchParams.get("error");
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const expectedState = sessionStorage.getItem("google_oauth_state");
    sessionStorage.removeItem("google_oauth_state");

    if (error) {
      return fail(
        error === "access_denied"
          ? "Google sign-up was cancelled."
          : "Google sign-in failed.",
      );
    }
    if (!code) return fail("No authorization code received from Google.");
    if (!state || state !== expectedState) {
      return fail("Invalid state — please try again.");
    }

    googleAuth.mutate(code, {
      onSuccess: () => navigate("/blog", { replace: true }),
      onError: () => navigate("/auth/login", { replace: true }),
    });
  }, []);

  return (
    <AuthLayout title="Signing you in…" subtitle="Finishing up with Google">
      <div
        className="flex justify-center py-6"
        role="status"
        aria-live="polite"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    </AuthLayout>
  );
}
