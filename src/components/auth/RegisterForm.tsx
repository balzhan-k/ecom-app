"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthForm } from "./AuthForm";

export function RegisterForm() {
  const {
    register,
    loginWithGoogle,
    user,
    userData,
    loading: authLoading,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Автоматическое перенаправление после регистрации
  useEffect(() => {
    if (user && userData && !authLoading) {
      if (userData.role === "admin") {
        router.push("/admin");
      } else {
        // Обычный пользователь идет домой
        router.push("/");
      }
    }
  }, [user, userData, authLoading, router]);

  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    try {
      await register(email, password);
      // Перенаправление произойдет автоматически в useEffect
    } catch (err) {
      setLoading(false);
      throw err; // Передаем ошибку в AuthForm для отображения
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      // Перенаправление произойдет автоматически в useEffect
    } catch (err) {
      setLoading(false);
      throw err; // Передаем ошибку в AuthForm для отображения
    }
  };

  return (
    <AuthForm
      mode="register"
      onSubmit={handleRegister}
      onGoogleAuth={handleGoogleLogin}
      loading={loading || authLoading}
    />
  );
}
