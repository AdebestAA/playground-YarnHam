import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { useRegister } from "../../hooks/useAuth";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();
  const register = useRegister();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!nickname || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password.length < 3) {
      toast.error("Password must be at least 3 characters.");
      return;
    }

    register.mutate(
      { nickname, email, password },
      { onSuccess: () => navigate("/auth/verify-email", { state: { email } }) },
    );
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start your writing journey today"
      footerText="Already have an account?"
      footerLink="/auth/login"
      footerLinkText="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nickname"
          type="text"
          placeholder="Your display name"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          icon={<User className="w-4 h-4" />}
        />

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
          placeholder="Min. 3 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
        />

        <Button
          type="submit"
          size="lg"
          isLoading={register.isPending}
          className="w-full"
        >
          Create Account
        </Button>
        {/* <Button
          onClick={handleGoogleSignup}
          type="button"
          size="lg"
          variant="ghost"
          className="w-full"
        >
          Sign up with Google
        </Button> */}
      </form>
    </AuthLayout>
  );
}
