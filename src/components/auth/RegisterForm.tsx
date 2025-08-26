"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthForm } from "./AuthForm";

export function RegisterForm() {
  const { register, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    try {
      await register(email, password);
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
      mode="register"
      onSubmit={handleRegister}
      onGoogleAuth={handleGoogleLogin}
      loading={loading}
    />
  );
}
