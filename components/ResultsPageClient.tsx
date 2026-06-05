"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ResultsPanel } from "@/components/ResultsPanel";
import { WarningBanner } from "@/components/WarningBanner";
import type { TranslationResult } from "@/lib/types";

export function ResultsPageClient() {
  const [result, setResult] = useState<TranslationResult | null>(null);

  useEffect(() => {
    const storedResult = window.sessionStorage.getItem("teckenbro:lastResult");

    if (storedResult) {
      setResult(JSON.parse(storedResult) as TranslationResult);
    }
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-6 sm:px-8 lg:py-10">
      <header className="flex flex-col gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-clay">TeckenBro</p>
          <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">Translation result</h1>
        </div>
        <div className="flex max-w-md flex-col gap-3">
          <WarningBanner />
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-clay hover:text-clay"
          >
            New translation
          </Link>
        </div>
      </header>

      {result ? (
        <ResultsPanel result={result} />
      ) : (
        <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">No result found</h2>
          <p className="mt-2 text-sm text-ink/70">Create a translation from the home page first.</p>
        </section>
      )}
    </main>
  );
}
