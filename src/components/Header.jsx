import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
        <div>
          <Link href="/" className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Humanizer AI</Link>
          <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">Rewrite AI-sounding text to sound human.</p>
        </div>
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-zinc-700 dark:text-zinc-200">{user.email}</span>
              <button onClick={logout} className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Login</Link>
              <Link href="/signup" className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}