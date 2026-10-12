import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useLogin } from "../../hooks/useAuth";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    login.mutate({ email, password }, { onSuccess: () => navigate("/blog") });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your journey"
      footerText="Don't have an account?"
      footerLink="/auth/register"
      footerLinkText="Create one"
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

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
        />

        <div className="flex justify-end -mt-1">
          <Link
            to="/auth/forgot-password"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={login.isPending}
          className="w-full"
        >
          Sign In
        </Button>
        {/* <Button
          onClick={handleGoogleSignin}
          type="button"
          size="lg"
          variant="ghost"
          className="w-full"
        >
          Sign in with Google
        </Button> */}
      </form>
    </AuthLayout>
  );
}
