import { atom } from "jotai";

interface UserDataType {
  userType: "admin" | "user",
  roomId: string,
}

export const userAtom = atom<UserDataType | null>(null);

export const userWsConnectionAtom = atom<WebSocket | null>(null);

export const activeUserAtom = atom<number>(0);