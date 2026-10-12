import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../stores/authStore";
import { getErrorMessage } from "../lib/errors";

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("userEmail", data.email);
      setUser({ email: data.email });
      toast.success("Welcome back!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Login failed"));
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({
      nickname,
      email,
      password,
    }: {
      nickname: string;
      email: string;
      password: string;
    }) => authService.register(nickname, email, password),
    onSuccess: () => {
      toast.success("Account created! Check your email for the OTP.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Registration failed"));
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authService.verifyEmail(email, otp),
    onSuccess: () => {
      toast.success("Email verified! You can now sign in.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Verification failed"));
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
    onSuccess: () => {
      toast.success("New code sent! Check your email.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to resend code"));
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success("Reset code sent! Check your email.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to send reset code"));
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      email,
      otp,
      new_password,
    }: {
      email: string;
      otp: string;
      new_password: string;
    }) => authService.resetPassword(email, otp, new_password),
    onSuccess: () => {
      toast.success("Password reset! You can now sign in.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to reset password"));
    },
  });
}

export function useLogout() {
  const clearUser = useAuthStore((s) => s.clearUser);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearUser();
    },
  });
}

export function useGoogleAuth() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (code: string) => authService.googleAuth(code),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("userEmail", data.email);
      setUser({ email: data.email });
      toast.success("Signed in with Google!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Google sign-in failed"));
    },
  });
}
