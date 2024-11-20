import { userWsConnectionAtom } from "@/state/atom/userAtom";
import { useAtom } from "jotai";
import { useEffect } from "react";

const ws_url = process.env.NEXT_PUBLIC_WS_Server || "http://localhost:3005";

export function useSocket() {
  const [socket, setSocket] = useAtom(userWsConnectionAtom);

  useEffect(() => {
    if (!socket) {
      const ws = new WebSocket(ws_url);

      ws.onclose = () => {
      };

      setSocket(ws);
    }

    return () => {
      socket?.close();
    };
  }, []);

  return socket;
}
