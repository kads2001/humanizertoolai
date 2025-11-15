"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function OtpPage() {
  const router = useRouter();
  const { requestOtp, verifyOtp, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [sentCode, setSentCode] = useState("");
  const [message, setMessage] = useState("");

  const emailValid = /^\S+@\S+\.\S+$/.test(email);

  const onSend = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!emailValid) return;
    const res = await requestOtp({ email });
    if (res.ok) {
      setSent(true);
      setSentCode(res.code || "");
      setMessage(res.message || "OTP sent");
    }
  };

  const onVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!code.trim()) return;
    const res = await verifyOtp({ email, code });
    if (res.ok) router.push("/");
  };

  const onResend = async () => {
    setMessage("");
    const res = await requestOtp({ email });
    if (res.ok) {
      setSent(true);
      setSentCode(res.code || "");
      setMessage(res.message || "OTP re-sent");
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Login with OTP</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Send a one-time code to your email and verify.</p>

      {!sent ? (
        <form onSubmit={onSend} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2.5 text-zinc-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black dark:text-zinc-100"
              required
            />
            {!emailValid && email.length > 0 && (
              <p className="mt-1 text-xs text-red-600">Enter a valid email address.</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}

          <button type="submit" disabled={loading || !emailValid} className="w-full rounded-md bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60">
            {loading ? "Sending..." : "Send code"}
          </button>
        </form>
      ) : (
        <div className="mt-6 space-y-4">
          {sentCode && process.env.NODE_ENV !== "production" && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-200">
              Development only: Your code is <span className="font-mono font-semibold">{sentCode}</span>
            </div>
          )}
          {message && <p className="text-sm text-green-700">{message}</p>}

          <form onSubmit={onVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">Verification code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2.5 text-zinc-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black dark:text-zinc-100"
                required
                maxLength={6}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading || !code.trim()} className="flex-1 rounded-md bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60">
                {loading ? "Verifying..." : "Verify"}
              </button>
              <button type="button" onClick={onResend} disabled={loading} className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
                Resend code
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}