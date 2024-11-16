"use client";
import { Button } from "@/components/ui/button";
import { musicPath } from "@/config";
import { wsDataType } from "@/utils/type";
import { useEffect, useRef, useState } from "react";

const wssUrl = process.env.NEXT_PUBLIC_WS_Server || "ws://localhost:8080";
const timeServerUrl =
  process.env.NEXT_PUBLIC_TIME_SERVER || "http://localhost:3005";

export default function Admin() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<boolean>(true);

  // Connect and send join message on initial render
  useEffect(() => {
    const socket = new WebSocket(wssUrl);

    socket.onopen = () => {
      setConnectionStatus("connected");
      socket.send(
        JSON.stringify({
          type: "join-mode",
          payload: {
            userType: "admin",
          },
        })
      );
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setConnectionStatus("connecting"); // Attempt to reconnect on close
    };

    setWs(socket);
    return () => {
      socket.close();
    };
  }, []);

  const handlePlayPause = async () => {
    if (!ws || connectionStatus !== "connected") return;

    const response = await fetch(timeServerUrl);
    const data = await response.json();
    const delay = 10 * 1000; // 10 sec
    if (audioPlayer.current) {
      setStatus((prev) => !prev);

      const jsonData: wsDataType = {
        type: "control-mode",
        payload: {
          musicId: 123,
          createdAt: data["datetime"],
          startAt: data["datetime"] + delay,
          currSeekPos: audioPlayer.current.currentTime,
          status: status ? "play" : "pause",
          speed: audioPlayer.current.playbackRate,
          volume: audioPlayer.current.volume,
        },
      };

      ws.send(JSON.stringify(jsonData));

      status
        ? setTimeout(() => {
            audioPlayer.current && audioPlayer.current.play();
          }, delay)
        : audioPlayer.current.pause();
      audioPlayer.current.muted = true;
    }
  };

  const handleOtherState = () => {
    if (!ws || connectionStatus !== "connected") return;
    if (audioPlayer.current) {
      const data: wsDataType = {
        type: "control-state",
        payload: {
          musicId: 123,
          speed: audioPlayer.current.playbackRate,
          volume: audioPlayer.current.volume,
          status: status ? "play" : "pause",
          createdAt: Date.now(),
          startAt: Date.now(),
          currSeekPos: audioPlayer.current.currentTime,
        },
      };

      ws.send(JSON.stringify(data));
    }
  };

  return (
    <div className="min-h-[90vh] h-fit flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Admin Page</h1>
        <div>
          {connectionStatus === "connecting" && "Connecting..."}
          {connectionStatus === "connected" && `Connected to ${wssUrl}`}
          {connectionStatus === "error" && "Connection Error"}
        </div>
        <div className="max-w-[90vw] w-96 flex justify-center bg-green-500">
          <audio
            ref={audioPlayer}
            controls
            muted
            loop
            onVolumeChange={() => {
              console.log("Volume changed");
              handleOtherState();
              console.log(
                audioPlayer.current ? audioPlayer.current.volume : "null"
              );
            }}
            onRateChange={() => {
              console.log("playback changed");
            }}
            className="w-full bg-red-400"
          >
            <source src={musicPath} type="audio/mpeg" />
          </audio>
        </div>
        <Button
          onClick={handlePlayPause}
          disabled={connectionStatus !== "connected"}
        >
          {status ? "Play" : "Stop"}
        </Button>
      </div>
    </div>
  );
}
