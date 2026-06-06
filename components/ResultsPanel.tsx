import { SignImageGallery } from "@/components/SignImageGallery";
import type { TranslationResult } from "@/lib/types";

type ResultsPanelProps = {
  result: TranslationResult;
};

export function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <section className="space-y-6">
      <SignImageGallery
        items={
          result.sequenceItems ??
          result.matchedSigns.map((sign) => ({ token: sign.swedishWord, sign }))
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
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
              result.signSequence.map((gloss, index) => (
                <span key={`${gloss}-${index}`} className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white">
                  {gloss}
                </span>
              ))
            ) : (
              <p className="text-sm text-ink/70">No signs matched the local database yet.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">Verified sign references</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {result.matchedSigns.map((sign, index) => (
              <article key={`${sign.id}-${index}`} className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-ink">{sign.swedishWord}</h4>
                    <p className="text-sm font-semibold text-clay">{sign.gloss}</p>
                  </div>
                  <div className="text-right">
                    <p className="sts-symbol max-w-28 truncate text-2xl font-bold text-ink">{sign.transcription}</p>
                    <p className="text-xs font-semibold text-moss">STS transcription</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/70">{sign.description}</p>
                <a
                  href={sign.lexiconUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-md border border-ink/15 px-3 py-2 text-xs font-semibold text-ink transition hover:border-clay hover:text-clay"
                >
                  Watch verified sign
                </a>
              </article>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink/55">
            Transcriptions and movement descriptions are sourced from Svenskt teckenspråkslexikon where available.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-ink">Missing signs</h3>
            {result.missingSigns.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {result.missingSigns.map((word, index) => (
                  <li key={`${word}-${index}`} className="rounded-md border border-clay/20 bg-clay/10 px-3 py-2 text-sm text-ink">
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

      <aside className="rounded-lg border border-ink/10 bg-mist p-4">
        <h3 className="text-lg font-semibold text-ink">Sequence symbols</h3>
        <ol className="mt-3 space-y-2">
          {result.matchedSigns.map((sign, index) => (
            <li key={`${sign.id}-${index}`} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-md bg-white px-3 py-2">
              <span className="text-xs font-bold text-clay">{index + 1}</span>
              <span className="font-semibold text-ink">{sign.gloss}</span>
              <span className="sts-symbol max-w-28 truncate text-lg font-semibold text-moss">{sign.transcription}</span>
            </li>
          ))}
        </ol>
      </aside>
      </div>
    </section>
  );
}
