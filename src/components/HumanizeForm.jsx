import { useState } from "react";

export default function HumanizeForm({ onHumanize }) {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("neutral");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onHumanize({ text: input, tone });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Input text</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        placeholder="Paste your AI-sounding text here..."
        className="mt-1 w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-black dark:text-gray-100"
      />

      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-black dark:text-gray-100"
        >
          <option value="neutral">Neutral</option>
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
        </select>

        <button
          type="submit"
          className="rounded-md bg-black px-5 py-2.5 text-white shadow-sm hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Humanize
        </button>
      </div>
    </form>
  );
}