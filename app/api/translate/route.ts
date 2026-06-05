import { NextResponse } from "next/server";
import { translateToSignLearningOutput } from "@/lib/translator";

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: unknown };
  const text = typeof body.text === "string" ? body.text : "";

  if (!text.trim()) {
    return NextResponse.json(
      { error: "Please provide Swedish or English text to translate." },
      { status: 400 }
    );
  }

  return NextResponse.json(translateToSignLearningOutput(text));
}
