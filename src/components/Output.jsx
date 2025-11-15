export default function Output({ result, isLoading, error }) {
  return (
    <section className="mx-auto mt-8 w-full max-w-3xl px-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Result</h2>
      <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900 dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-100">
        {isLoading ? (
          <p className="animate-pulse text-gray-600 dark:text-gray-400">Humanizing your text...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : result ? (
          <p className="whitespace-pre-wrap">{result}</p>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Your humanized text will appear here.</p>
        )}
      </div>
    </section>
  );
}