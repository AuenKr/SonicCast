"use client";
import { Button } from "@/components/ui/button";
import { musicPath } from "@/config";
import { wsConnectionSentType, wsDataReceiveType } from "@repo/types";
import { useEffect, useRef, useState } from "react";

export default function UserPage() {
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const [delay, setDelay] = useState(0);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_WS_Server || "ws://localhost:8080"
    );

    socket.onopen = () => {
      setConnectionStatus("connected");
      const data: wsConnectionSentType = {
        type: "join-mode",
        payload: {
          userType: "user",
        },
      };
      socket.send(JSON.stringify(data));
    };

    socket.onmessage = async (event) => {
      const body: wsDataReceiveType = JSON.parse(event.data);
      if (audioPlayer.current) {
        const payload = body.payload;
        switch (body.type) {
          case "control-mode":
            const serverTime = body.serverTime;

            const adjustedSeekTime = payload.startAt - serverTime.getTime();
            setDelay(adjustedSeekTime);

            audioPlayer.current.currentTime = payload.currSeekPos;
            audioPlayer.current.playbackRate = payload.speed;
            audioPlayer.current.volume = payload.volume;

            payload.status === "play"
              ? setTimeout(() => {
                  audioPlayer.current && audioPlayer.current.play();
                }, adjustedSeekTime)
              : audioPlayer.current.pause();
            break;

          case "control-state":
            audioPlayer.current.playbackRate = payload.speed;
            audioPlayer.current.volume = payload.volume;
            break;

          default:
            console.log("Invalid body type ", body.type);
        }
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setConnectionStatus("connecting"); // Attempt to reconnect on close
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="min-h-[90vh] h-fit flex flex-col justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">User Page</h1>
        <div>
          {connectionStatus === "connecting" && "Connecting..."}
          {connectionStatus === "connected" &&
            `Connected to ${process.env.NEXT_PUBLIC_WS_Server || "ws://localhost:8080"}`}
          {connectionStatus === "error" && "Connection Error"}
        </div>
        <div className="flex justify-center w-full">
          <audio
            ref={audioPlayer}
            loop
            controls
            controlsList="nodownload noplaybackrate"
            className="max-w-md"
          >
            <source src={musicPath} type="audio/mpeg" />
          </audio>
        </div>
        <div className="flex justify-center w-full mt-4">
          {!status ? (
            <Button onClick={() => setStatus(true)}>Connect to group</Button>
          ) : (
            <div>Start in : {delay / 1000}</div>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
}
