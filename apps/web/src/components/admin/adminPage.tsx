"use client";

import { SearchBar } from "@/components/searchBar";
import { SongPlayer } from "./songPlayer";
import { useUser } from "@/hooks/useUser";
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";
import { wsInitialDataSentType } from "@repo/types";
import { wsSendMsg } from "@/lib";

export function AdminPage({ id }: { id: string }) {
  const user = useUser();
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !user) return;

    socket.onopen = () => {
      const joinDataAdmin: wsInitialDataSentType = {
        type: "join-mode",
        roomId: user.roomId,
        payload: {
          userType: "admin",
        },
        createTime: new Date(),
      };

      wsSendMsg(socket, joinDataAdmin);
    };

    // socket.onmessage = (event) => {
    //   const body = wsReceiveMsg(event);
    //   console.log(body);
    // };
  }, [socket, user]);

  return (
    <div className="flex flex-col items-center gap-2 mt-5">
      <div className="gap-2 flex flex-col text-center">
        <span className="font-bold">Admin Page</span>
        <span>
          Room Id : <span className="font-bold">{id}</span>
        </span>
      </div>
      <div className="w-full max-w-lg">
        <SearchBar />
      </div>
      <div className="w-full max-w-md h-[70vh]">
        <SongPlayer />
      </div>
    </div>
  );
}
