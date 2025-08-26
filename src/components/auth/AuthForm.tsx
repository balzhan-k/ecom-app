"use client";
import { useState } from "react";
import { AuthInput } from "./AuthInput";
import Button from "@/components/common/Button";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleAuth: () => Promise<void>;
  loading: boolean;
}

export function AuthForm({
  mode,
  onSubmit,
  onGoogleAuth,
  loading,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Валидация
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (mode === "register" && password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const title = mode === "login" ? "Sign In" : "Create Account";
  const submitText = mode === "login" ? "Sign In" : "Sign Up";
  const switchText =
    mode === "login" ? "Don't have an account?" : "Already have an account?";
  const switchLink = mode === "login" ? "/register" : "/login";

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h1 className="text-2xl font-bold text-center text-cyan-700 mb-6">
        {title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          placeholder="Enter your email"
          required
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          placeholder="Enter your password"
          required
        />

        {mode === "register" && (
          <AuthInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Repeat your password"
            required
          />
        )}

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-700 hover:bg-cyan-800 text-white"
        >
          {loading ? "Loading..." : submitText}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <div className="mt-6">
          <GoogleAuthButton onClick={onGoogleAuth} disabled={loading} />
        </div>
      </div>

      <div className="mt-6 text-center">
        <span className="text-gray-600">{switchText} </span>
        <a
          href={switchLink}
          className="text-cyan-700 hover:text-cyan-800 font-medium"
        >
          {mode === "login" ? "Sign Up" : "Sign In"}
        </a>
      </div>
    </div>
  );
}
