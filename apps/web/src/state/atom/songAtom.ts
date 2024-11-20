import { SongDetailType } from "@repo/types";
import { SongRunningStatusType } from "@repo/types";
import { atom } from "jotai";

export const songDetailAtom = atom<SongDetailType | null>(null);

export const songRunningStatusAtom = atom<SongRunningStatusType | null>(null);