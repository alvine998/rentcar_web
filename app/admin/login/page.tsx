"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CarFront, Eye, EyeOff, Lock } from "lucide-react";
import { setAdminSession } from "@/lib/admin-auth";

const DEMO_EMAIL = "admin@nusarentcar.id";
const DEMO_PASSWORD = "admin123";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        setAdminSession();
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    }, 350);
  }

  return (
    <div className="hero-bg flex min-h-screen items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-accent text-white">
            <CarFront className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Nusa Rentcar
          </h1>
          <p className="label mt-2 text-muted">Admin console</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-line bg-surface p-8 shadow-sm"
        >
          <label className="block">
            <span className="label mb-2 block text-muted">Email</span>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nusarentcar.id"
              className="input"
              autoComplete="username"
            />
          </label>

          <label className="mt-5 block">
            <span className="label mb-2 block text-muted">Password</span>
            <span className="relative block">
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pr-11"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-0 top-0 flex h-[2.75rem] w-11 items-center justify-center text-muted transition-colors hover:text-accent-strong"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden />
                )}
              </button>
            </span>
          </label>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
          >
            <Lock className="h-4 w-4" aria-hidden />
            {loading ? "Signing in…" : "Sign in"}
          </motion.button>

          <p className="mt-6 rounded-md border border-dashed border-line px-3 py-2.5 text-xs leading-relaxed text-muted">
            <span className="font-medium text-ink">Demo access</span> — email:{" "}
            {DEMO_EMAIL}, password: {DEMO_PASSWORD}
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Nusa Rentcar content management · internal use only
        </p>
      </motion.div>
    </div>
  );
}
