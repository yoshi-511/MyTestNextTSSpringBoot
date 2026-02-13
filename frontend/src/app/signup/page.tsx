"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { setAuth, isAuthenticated } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  function showError(text: string) {
    setMessage({ text, type: "error" });
    setTimeout(() => setMessage(null), 5000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await api.auth.signup({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      setAuth(data.token, data.username, data.email);
      setMessage({
        text: "Account created successfully! Redirecting...",
        type: "success",
      });
      setTimeout(() => router.push("/"), 1000);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to create account"
      );
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-[450px]">
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-2 drop-shadow-md">
            Create Account
          </h1>
          <p className="text-base opacity-90">
            Sign up to start managing your items
          </p>
        </div>

        <div className="bg-white rounded-xl p-10 shadow-2xl">
          {message && (
            <div
              className={`p-3 rounded-lg mb-5 text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block mb-2 font-semibold text-gray-700 text-sm"
              >
                Username *
              </label>
              <input
                type="text"
                id="username"
                required
                minLength={3}
                maxLength={50}
                placeholder="Choose a username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 font-semibold text-gray-700 text-sm"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                maxLength={100}
                placeholder="your.email@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 font-semibold text-gray-700 text-sm"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                required
                minLength={6}
                maxLength={100}
                placeholder="Create a strong password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            <div className="mb-5">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 font-semibold text-gray-700 text-sm"
              >
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                required
                minLength={6}
                maxLength={100}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3.5 rounded-lg text-base font-semibold text-white bg-gradient-to-br from-[#667eea] to-[#764ba2] hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-5 text-gray-500 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#667eea] font-semibold no-underline hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
