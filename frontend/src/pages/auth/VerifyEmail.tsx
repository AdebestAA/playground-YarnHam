import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useResendVerification, useVerifyEmail } from "../../hooks/useAuth";
import { onlyDigits } from "../../helpers";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();

  const email = (location.state as { email?: string })?.email || "";
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = () => {
    if (!email) {
      toast.error("Please register again to get a new code.");
      navigate("/auth/register");
      return;
    }
    resendVerification.mutate(email, {
      onSuccess: () => setCooldown(60),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    verifyEmail.mutate(
      { email, otp },
      { onSuccess: () => navigate("/auth/login") },
    );
  };

  return (
    <AuthLayout
      title="Check your email"
      subtitle={`We sent a 6-digit code to ${email || "your inbox"}`}
      footerText="Didn't receive the code?"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1.5">
            OTP Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(onlyDigits(e.target.value))}
            className="w-full px-6 py-4 rounded-xl bg-white border border-navy-200 text-navy-900 text-center text-3xl font-bold tracking-[0.5em] placeholder:text-navy-300 transition-all duration-200 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 hover:border-navy-300"
          />
        </div>

        <Button type="submit" size="lg" isLoading={verifyEmail.isPending} className="w-full">
          Verify Email
        </Button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendVerification.isPending || cooldown > 0}
          className="w-full text-center text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendVerification.isPending
            ? "Sending…"
            : cooldown > 0
              ? `Resend code in ${cooldown}s`
              : "Resend code"}
        </button>
      </form>
    </AuthLayout>
  );
}
