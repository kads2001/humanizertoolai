"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ email, password });
    if (res.ok) router.push("/");
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Login</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Access your account to use Humanizer AI.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2.5 text-zinc-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2.5 text-zinc-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black dark:text-zinc-100"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        Don’t have an account? <a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
      </p>

      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Prefer OTP? <a href="/otp" className="text-indigo-600 hover:underline">Login with OTP</a>
      </p>
    </main>
  );
}