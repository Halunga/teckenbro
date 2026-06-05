import signs from "@/data/signs.json";
import type { SignEntry } from "@/lib/types";

export const signDatabase = signs as SignEntry[];

export function findSignBySwedishWord(word: string) {
  return signDatabase.find((sign) => sign.swedishWord === word);
}
