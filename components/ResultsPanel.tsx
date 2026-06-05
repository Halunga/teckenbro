"use client";

import { AvatarPanel } from "@/components/AvatarPanel";
import type { TranslationResult } from "@/lib/types";

type ResultsPanelProps = {
  result: TranslationResult;
};

export function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-ink">Learning result</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-ink/10 bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-moss">Original text</dt>
              <dd className="mt-2 text-base text-ink">{result.originalText}</dd>
            </div>
            <div className="rounded-lg border border-ink/10 bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-moss">Simplified Swedish</dt>
              <dd className="mt-2 text-base text-ink">{result.simplifiedSwedish || "No simplified words found."}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">Sign sequence</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.signSequence.length > 0 ? (
              result.signSequence.map((gloss) => (
                <span key={gloss} className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white">
                  {gloss}
                </span>
              ))
            ) : (
              <p className="text-sm text-ink/70">No signs matched the local database yet.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">Sign cards</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {result.matchedSigns.map((sign) => (
              <article key={sign.id} className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-ink">{sign.swedishWord}</h4>
                    <p className="text-sm font-semibold text-clay">{sign.gloss}</p>
                  </div>
                  <span className="rounded-md bg-mist px-2 py-1 text-xs font-medium text-moss">placeholder</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/70">{sign.description}</p>
                <p className="mt-3 break-all text-xs text-ink/55">{sign.videoUrl}</p>
                <p className="mt-1 break-all text-xs text-ink/55">{sign.animationKey}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-ink">Missing signs</h3>
            {result.missingSigns.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {result.missingSigns.map((word) => (
                  <li key={word} className="rounded-md border border-clay/20 bg-clay/10 px-3 py-2 text-sm text-ink">
                    {word}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink/70">All detected keywords have sample sign entries.</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-ink">Confidence warnings</h3>
            <ul className="mt-2 space-y-2">
              {result.confidenceWarnings.map((warning) => (
                <li key={warning} className="rounded-md border border-ink/10 bg-paper px-3 py-2 text-sm text-ink/75">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <AvatarPanel activeAnimationKeys={result.matchedSigns.map((sign) => sign.animationKey)} />
    </section>
  );
}
