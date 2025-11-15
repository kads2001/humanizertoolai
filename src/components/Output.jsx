export default function Output({ result, isLoading, error }) {
  return (
    <section className="mx-auto mt-8 w-full max-w-3xl px-4">
      <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Result</h2>
          {result && (
            <button
              className="text-xs font-medium text-indigo-700 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200"
              onClick={() => navigator.clipboard.writeText(result)}
            >
              Copy
            </button>
          )}
        </div>

        <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
          {isLoading ? (
            <p className="animate-pulse text-zinc-600 dark:text-zinc-400">Humanizing your text...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : result ? (
            <p className="whitespace-pre-wrap">{result}</p>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400">Your humanized text will appear here.</p>
          )}
        </div>
      </div>
    </section>
  );
}