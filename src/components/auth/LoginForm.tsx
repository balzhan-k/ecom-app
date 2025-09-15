"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthForm } from "./AuthForm";

export function LoginForm() {
  const {
    login,
    loginWithGoogle,
    user,
    userData,
    loading: authLoading,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user && userData && !authLoading) {
      if (userData.role === "admin") {
        router.push("/admin");
      } else {
        if (window.location.pathname === "/login") {
          router.push("/");
        }
      }
    }
  }, [user, userData, authLoading, router]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setLoading(false);
      throw err; 
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setLoading(false);
      throw err; 
    }
  };

  return (
    <AuthForm
      type="login"
      onSubmit={handleLogin}
      onGoogleAuth={handleGoogleLogin}
      loading={loading || authLoading}
    />
  );
}
