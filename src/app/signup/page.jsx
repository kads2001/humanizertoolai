"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await signup({ name, email, password });
    if (res.ok) router.push("/login");
  };

  return (
    <main className="mx-auto w/full max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Sign up</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Create your account to start humanizing text.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2.5 text-zinc-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black dark:text-zinc-100"
            required
          />
        </div>

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
            minLength={6}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
      </p>
    </main>
  );
}