"use client";
import Header from "@/components/Header";
import HumanizeForm from "@/components/HumanizeForm";
import Output from "@/components/Output";
import { useEffect, useState } from "react";

export default function Home() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // history state: { id, text, tone, result, ts }
  const [history, setHistory] = useState([]);
  const [externalPreset, setExternalPreset] = useState(null); // { text, tone }

  // Safe JSON parsing to avoid "Unexpected end of JSON input"
  async function parseJsonSafe(res) {
    const ct = res.headers?.get?.("content-type") || "";
    if (ct.includes("application/json")) {
      try {
        return await res.json();
      } catch {
        return {};
      }
    }
    try {
      const t = await res.text();
      return { error: t };
    } catch {
      return {};
    }
  }

  // Load history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("humanizer-history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  const saveHistory = (items) => {
    setHistory(items);
    try { localStorage.setItem("humanizer-history", JSON.stringify(items)); } catch {}
  };

  const addHistory = (item) => {
    const next = [item, ...history].slice(0, 100); // cap at 100
    saveHistory(next);
  };

  const handleHumanize = async ({ text, tone }) => {
    try {
      setIsLoading(true);
      setError("");
      setResult("");

      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || `Something went wrong (${res.status})`);
      const final = data.result || "";
      setResult(final);
      addHistory({ id: Date.now(), text, tone, result: final, ts: Date.now() });
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const reuseItem = (item) => {
    setExternalPreset({ text: item.text, tone: item.tone });
  };

  const copyOriginal = async (item) => {
    try { await navigator.clipboard.writeText(item.text || ""); } catch {}
  };

  const copyResult = async (item) => {
    try { await navigator.clipboard.writeText(item.result || ""); } catch {}
  };

  const deleteItem = (id) => {
    const next = history.filter((h) => h.id !== id);
    saveHistory(next);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-4">
        <div className="flex gap-6">
          {/* Persistent left sidebar: Humanize history */}
          <aside className="hidden shrink-0 basis-64 md:block">
            <div className="sticky top-4 rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">History</h3>
                <button onClick={clearHistory} className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Clear</button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-2">
                {history.length === 0 ? (
                  <p className="px-2 py-2 text-sm text-zinc-600 dark:text-zinc-400">No history yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {history.map((item) => (
                      <li key={item.id} className="rounded-md border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(item.ts).toLocaleString()}</div>
                          <span className="ml-2 rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">{item.tone}</span>
                        </div>
                        {/* Show both Original (default text) and Result (humanized) */}
                        <div className="mt-1 space-y-1">
                          <p className="line-clamp-2 text-xs text-zinc-700 dark:text-zinc-200"><span className="font-semibold">Original:</span> {item.text || "—"}</p>
                          <p className="line-clamp-2 text-xs text-zinc-700 dark:text-zinc-200"><span className="font-semibold">Result:</span> {item.result || "—"}</p>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button onClick={() => reuseItem(item)} className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Reuse</button>
                          <button onClick={() => copyOriginal(item)} className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Copy Original</button>
                          <button onClick={() => copyResult(item)} className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Copy Result</button>
                          <button onClick={() => deleteItem(item.id)} className="ml-auto rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20">Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="flex-1">
            <HumanizeForm onHumanize={handleHumanize} externalPreset={externalPreset} />
            <Output result={result} isLoading={isLoading} error={error} />
          </section>
        </div>
      </main>
    </div>
  );
}
