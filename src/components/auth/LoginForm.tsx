"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthForm } from "./AuthForm";

export function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      mode="login"
      onSubmit={handleLogin}
      onGoogleAuth={handleGoogleLogin}
      loading={loading}
    />
  );
}
