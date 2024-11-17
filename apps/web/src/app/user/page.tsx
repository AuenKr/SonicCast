"use client";
import { Button } from "@/components/ui/button";
import { musicPath } from "@/config";
import { wsDataType } from "@/utils/type";
import { useEffect, useRef, useState } from "react";

const wssUrl = process.env.NEXT_PUBLIC_WS_Server || "ws://localhost:8080";
const timeServerUrl =
  process.env.NEXT_PUBLIC_TIME_SERVER || "http://localhost:3005";

export default function User() {
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const [delay, setDelay] = useState(0);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    const socket = new WebSocket(wssUrl);

    socket.onopen = () => {
      setConnectionStatus("connected");
      socket.send(
        JSON.stringify({
          type: "join-mode",
          payload: {
            userType: "user",
          },
        })
      );
    };

    socket.onmessage = async (event) => {
      const body: wsDataType = JSON.parse(event.data);
      if (audioPlayer.current) {
        const payload = body.payload;
        switch (body.type) {
          case "control-mode":
            const start = Date.now();
            const response = await fetch(timeServerUrl);
            const data = await response.json();
            const end = Date.now();

            const adjustedSeekTime =
              payload.startAt - data["datetime"] - (end - start);
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
          {connectionStatus === "connected" && `Connected to ${wssUrl}`}
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
