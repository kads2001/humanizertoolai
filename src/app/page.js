"use client";
import Header from "@/components/Header";
import HumanizeForm from "@/components/HumanizeForm";
import Output from "@/components/Output";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data.result || "");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full">
        <Header />
        <section className="py-6">
          <HumanizeForm onHumanize={handleHumanize} />
          <Output result={result} isLoading={isLoading} error={error} />
        </section>
      </main>
    </div>
  );
}
