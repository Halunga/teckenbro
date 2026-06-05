"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WarningBanner } from "@/components/WarningBanner";
import type { TranslationResult } from "@/lib/types";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognition = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type SpeechRecognitionEvent = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function HomeTranslator() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function translateText() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      const data = (await response.json()) as TranslationResult | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Could not translate this text.");
      }

      window.sessionStorage.setItem("teckenbro:lastResult", JSON.stringify(data));
      router.push("/results");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not translate this text.");
    } finally {
      setIsLoading(false);
    }
  }

  function startSpeechRecognition() {
    setError("");
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!Recognition) {
      setError("Your browser does not support the Web Speech API. Try typing text instead.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "sv-SE";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length })
        .map((_, index) => event.results[index][0].transcript)
        .join(" ");

      setText((currentText) => [currentText, transcript].filter(Boolean).join(" "));
    };

    recognition.onerror = () => {
      setError("Speech recognition stopped before a transcript was created.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setIsListening(true);
    recognition.start();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-6 sm:px-8 lg:py-10">
      <header className="flex flex-col gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-clay">TeckenBro</p>
          <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">Swedish Sign Language learning output</h1>
        </div>
        <div className="max-w-md">
          <WarningBanner />
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
          <label htmlFor="translation-input" className="text-sm font-semibold text-ink">
            Swedish or English input
          </label>
          <textarea
            id="translation-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Example: Jag vill ha vatten imorgon"
            className="mt-3 min-h-40 w-full resize-y rounded-lg border border-ink/15 bg-paper p-4 text-base text-ink outline-none transition focus:border-clay focus:ring-4 focus:ring-clay/15"
          />
          {error ? <p className="mt-3 text-sm font-medium text-clay">{error}</p> : null}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={translateText}
              disabled={isLoading || !text.trim()}
              className="rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:bg-ink/35"
            >
              {isLoading ? "Translating..." : "Translate to Swedish Sign Language"}
            </button>
            <button
              type="button"
              onClick={startSpeechRecognition}
              disabled={isListening}
              className="rounded-lg border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-clay hover:text-clay disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isListening ? "Listening..." : "Use microphone"}
            </button>
          </div>
        </div>

        <aside className="rounded-lg border border-ink/10 bg-mist p-4">
          <h2 className="text-base font-semibold text-ink">Sample words</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            jag, du, vilja, äta, skola, imorgon, tack, hjälp, vatten, arbete
          </p>
        </aside>
      </section>
    </main>
  );
}
