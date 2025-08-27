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

  // Автоматическое перенаправление после логина
  useEffect(() => {
    if (user && userData && !authLoading) {
      if (userData.role === "admin") {
        router.push("/admin");
      } else {
        // Обычный пользователь остается на текущей странице или идет домой
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
      mode="login"
      onSubmit={handleLogin}
      onGoogleAuth={handleGoogleLogin}
      loading={loading || authLoading}
    />
  );
}
