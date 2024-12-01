"use client";

import {
  wsInitialDataSentType,
  wsServerControlModeType,
  wsServerErrorModeType,
  wsServerJoinModeType,
  wsServerModeType,
  wsServerStateModeType,
  wsServerUpdateModeType,
} from "@repo/types";

import { UserSongPlayer } from "./userSongPlayer";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useSocket } from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";
import { wsReceiveMsg, wsSendMsg } from "@/lib";
import { activeUserAtom } from "@/state/atom/userAtom";
import { useAtomValue } from "jotai";
import { useToast } from "@/hooks/use-toast";
import { useUserWebSocketHandler } from "@/hooks/useWsHandler";

export function UserPage({ id }: { id: string }) {
  const [firstTouch, setFirstTouch] = useState<boolean>(false);
  const socket = useSocket();
  const user = useUser();

  const activeUser = useAtomValue(activeUserAtom);

  const { toast } = useToast();
  const {
    handleJoinMode,
    handleControlMode,
    handleControlState,
    handleUpdateMode,
    handleServerError,
  } = useUserWebSocketHandler();

  useEffect(() => {
    if (!socket || !user) return;

    socket.onopen = () => {
      const joinDataAdmin: wsInitialDataSentType = {
        type: "join-mode",
        roomId: user.roomId,
        payload: {
          userType: "user",
        },
        createTime: new Date(),
      };

      wsSendMsg(socket, joinDataAdmin);
    };

    socket.onmessage = (event) => {
      const body: wsServerModeType = wsReceiveMsg(event);

      switch (body.type) {
        case "join-mode": // Initial room join
          toast({
            title: "Connected to room",
          });
          handleJoinMode(body as unknown as wsServerJoinModeType);
          break;

        case "control-mode": // handle the only play, speed increase logic
          handleControlMode(body as unknown as wsServerControlModeType);
          break;

        case "control-state": // Broadcast to all user song has changed
          handleControlState(body as unknown as wsServerStateModeType);
          break;

        case "update-mode": // Broadcast to all room user, about song status: volume, pause.
          handleUpdateMode(body as unknown as wsServerUpdateModeType);
          break;

        case "server-error": // Server error occur
          const errorMsg = handleServerError(
            body as unknown as wsServerErrorModeType
          );
          toast({
            title: errorMsg,
            variant: "destructive",
          });
          break;

        default:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const msg: string = (body as unknown as any).msg;
          console.warn("Unknown message type:", body.type);
          toast({
            title: msg,
            variant: "destructive",
          });
      }
    };
  }, [socket, user]);

  return (
    <div className="flex flex-col items-center gap-2 mt-5">
      <div className="gap-2 flex flex-col text-center">
        <span className="font-bold">User Page</span>
        <span>
          Room Id : <span className="font-bold">{id}</span>
        </span>
        <span>Active User: {activeUser}</span>
      </div>
      {!firstTouch && (
        <Button onClick={() => setFirstTouch(true)} variant="destructive">
          Click to Connect Group
        </Button>
      )}
      <div className="w-full max-w-md h-[70vh]">
        <UserSongPlayer />
      </div>
    </div>
  );
}
