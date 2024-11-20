import { CreateTimeType } from "@/utils/types";
import { atom } from "jotai";

interface UserDataType {
  userType: "admin" | "user",
  roomId: string,
  delay?: number,
}

export const userAtom = atom<UserDataType | null>(null);

export const userWsConnectionAtom = atom<WebSocket | null>(null);

export const clientTime = atom<CreateTimeType | null>(null);

export const activeUserAtom = atom<number>(0);