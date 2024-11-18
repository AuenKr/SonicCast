import { SearchResultType } from "@/utils/type";
import { atom } from "jotai";

export const songDetailAtom = atom<SearchResultType | null>(null);