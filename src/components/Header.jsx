export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center gap-3">
          <img src="/globe.svg" alt="Logo" className="h-8 w-8 opacity-90" />
          <h1 className="text-3xl font-bold tracking-tight">Humanizer AI</h1>
        </div>
        <p className="mt-3 max-w-2xl text-base/7 opacity-90">
          Paste any AI-sounding text and instantly rewrite it to sound more natural, clear, and human.
        </p>
      </div>
    </header>
  );
}