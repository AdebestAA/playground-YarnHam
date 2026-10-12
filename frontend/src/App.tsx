import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "./lib/queryClient";
import { useAuthStore } from "./stores/authStore";
import BlogLayout from "./components/layout/BlogLayout";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import PostsList from "./pages/blog/PostsList";
import PostDetail from "./pages/blog/PostDetail";
import CreatePost from "./pages/blog/CreatePost";
import Profile from "./pages/account/Profile";
import NotFound from "./pages/NotFound";
import GoogleCallback from "./pages/auth/GoogleCallback";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  if (user) {
    return <Navigate to="/blog" replace />;
  }
  return <>{children}</>;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />} />

          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route
            path="/auth/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/auth/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/auth/verify-email"
            element={
              <GuestRoute>
                <VerifyEmail />
              </GuestRoute>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={
              <GuestRoute>
                <ForgotPassword />
              </GuestRoute>
            }
          />
          <Route
            path="/auth/reset-password"
            element={
              <GuestRoute>
                <ResetPassword />
              </GuestRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <BlogLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/blog" element={<PostsList />} />
            <Route path="/blog/create" element={<CreatePost />} />
            <Route path="/blog/:id" element={<PostDetail />} />
            <Route path="/account" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0b0e11",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: "#ffffff",
                secondary: "#0b0e11",
              },
            },
            error: {
              iconTheme: {
                primary: "#ffffff",
                secondary: "#0b0e11",
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
