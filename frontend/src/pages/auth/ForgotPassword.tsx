import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useForgotPassword } from "../../hooks/useAuth";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const forgotPassword = useForgotPassword();

  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email address.");
      return;
    }

    forgotPassword.mutate(trimmed, {
      onSuccess: () =>
        navigate("/auth/reset-password", { state: { email: trimmed } }),
    });
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset code."
      footerText="Remembered your password?"
      footerLink="/auth/login"
      footerLinkText="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
        />

        <Button type="submit" size="lg" isLoading={forgotPassword.isPending} className="w-full">
          Send reset code
        </Button>
      </form>
    </AuthLayout>
  );
}
