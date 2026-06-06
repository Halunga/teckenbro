import Image from "next/image";
import type { TranslationSequenceItem } from "@/lib/types";

type SignImageGalleryProps = {
  items: TranslationSequenceItem[];
};

export function SignImageGallery({ items }: SignImageGalleryProps) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-clay">Sign sequence</p>
          <h2 className="mt-1 text-2xl font-bold text-ink">Static sign references</h2>
        </div>
        <p className="text-right text-xs text-ink/55">Images: Svenskt teckenspråkslexikon</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ token, sign }, index) => (
          <article
            key={`${token}-${index}`}
            className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft"
          >
            <div className="relative aspect-[4/3] bg-mist">
              {sign?.imageUrl ? (
                <Image
                  src={sign.imageUrl}
                  alt={`Static reference for ${sign.swedishWord}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain"
                  priority={index < 3}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-ink/60">
                  No verified 2D sign image yet
                </div>
              )}
              <span className="absolute left-2 top-2 rounded-md bg-ink px-2 py-1 text-xs font-bold text-white">
                {index + 1}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 px-3 py-3">
              <div>
                <p className="font-semibold text-ink">{token}</p>
                <p className="text-xs font-semibold text-clay">{sign?.gloss ?? "MISSING SIGN"}</p>
              </div>
              {sign ? (
                <a
                  href={sign.lexiconUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-moss underline"
                >
                  Open sign
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
