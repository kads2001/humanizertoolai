"use client";
import { useState, useEffect } from "react";

export default function HumanizeForm({ onHumanize, externalPreset }) {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("neutral");

  useEffect(() => {
    if (externalPreset?.text) setInput(externalPreset.text);
    if (externalPreset?.tone) setTone(externalPreset.tone);
  }, [externalPreset]);

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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4">
      <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">Input text</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        placeholder="Paste your AI-sounding text here..."
        className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black dark:text-zinc-100"
      />

      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black dark:text-zinc-100"
        >
          <option value="neutral">Neutral</option>
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
        </select>
        <div className="ml-auto text-xs text-zinc-500 dark:text-zinc-400">{input.length} characters</div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={applySample}
          className="mr-auto text-sm font-medium text-zinc-700 hover:underline dark:text-zinc-300"
        >
          Try sample
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-600"
        >
          Humanize
        </button>
      </div>
    </form>
  );
}