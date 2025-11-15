"use client";
import { useState } from "react";

export default function HumanizeForm({ onHumanize }) {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("neutral");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onHumanize({ text: input, tone });
  };

  const applySample = () => {
    setInput(
      "In today's fast-paced digital landscape, leveraging cutting-edge solutions can catalyze transformative outcomes across multidisciplinary domains."
    );
    setTone("friendly");
  };

  const tones = [
    { value: "neutral", label: "Neutral" },
    { value: "friendly", label: "Friendly" },
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4">
      <div className="rounded-2xl border border-zinc-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-start justify-between p-4 sm:p-5">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Input text</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Paste your AI-sounding text and choose a tone.</p>
          </div>
          <button
            type="button"
            onClick={applySample}
            className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            aria-label="Insert sample text"
          >
            Try sample
          </button>
        </div>

        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={7}
            placeholder="Paste your AI-sounding text here..."
            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 shadow-inner placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-black dark:text-zinc-100"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tone:</span>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTone(t.value)}
                  className={`${
                    tone === t.value
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  } rounded-lg px-3 py-1.5 text-sm font-medium transition-colors`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="ml-auto text-xs text-zinc-500 dark:text-zinc-400">{input.length} characters</div>
          </div>

          <div className="mt-5 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Humanize text
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}