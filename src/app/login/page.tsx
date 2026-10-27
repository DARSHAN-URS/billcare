"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBillCare } from "@/lib/billcare-context";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useBillCare();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Please enter your work email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Please enter your password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        if (rememberMe) {
          localStorage.setItem("billcare_remember_email", email.trim());
        } else {
          localStorage.removeItem("billcare_remember_email");
        }
        router.push("/dashboard");
      } else {
        setErrors({ general: res.error || "Invalid email or password. Please try again." });
      }
    } catch (err: any) {
      setErrors({ general: err.message || "An unexpected error occurred during sign in." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      headline="Welcome back."
      supportingText="Sign in to manage your salon."
      imageSrc="/images/spa-wellness.jpg"
      imageAlt="Modern salon interior"
    >
      <div className="bg-[#101010] border border-[#27272A] rounded-2xl p-7 sm:p-9 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-[#F8FAFC]">
            Sign in to Bill Care
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-1.5">
            Enter your credentials to access your workspace.
          </p>
        </div>

        {errors.general && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-lg bg-[#F87171]/10 border border-[#F87171]/30 text-xs text-[#F87171] flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <AuthInput
            label="Work email"
            id="work-email"
            type="email"
            autoComplete="email"
            placeholder="you@yoursalon.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            icon={<Mail className="w-4 h-4" />}
            required
            autoFocus
          />

          <div>
            <AuthInput
              label="Password"
              id="password"
              isPassword
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between mt-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#0B0B0B] border border-[#27272A] text-[#FACC15] focus:ring-[#FACC15] focus:ring-offset-0 focus:ring-1 cursor-pointer accent-[#FACC15]"
                />
                <span>Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-[#FACC15] hover:text-[#EAB308] transition-colors font-medium focus:outline-none focus:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <AuthButton isLoading={isLoading}>
              Sign In
            </AuthButton>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-[#27272A] text-center text-xs text-[#A1A1AA]">
          <span>New to Bill Care? </span>
          <Link
            href="/signup"
            className="text-[#FACC15] hover:text-[#EAB308] font-medium transition-colors focus:outline-none focus:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
