"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { songDetailAtom, songRunningStatusAtom } from "@/state/atom/songAtom";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  SongRunningStatusType,
  wsClientControlModeType,
  wsClientUpdateModeType,
} from "@repo/types";
import { userAtom, userWsConnectionAtom } from "@/state/atom/userAtom";
import { wsSendMsg } from "@/lib";

export function SongPlayer() {
  const song = useAtomValue(songDetailAtom);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentVolume, setCurrentVolume] = useState<number>(100);
  const [speed, setSpeed] = useState<number>(1);

  const [songRunningStatus, setSongRunningStatus] = useAtom(
    songRunningStatusAtom
  );

  const socket = useAtomValue(userWsConnectionAtom);
  const user = useAtomValue(userAtom);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Control state mode
  useEffect(() => {
    if (!songRunningStatus) return;

    setCurrentTime(songRunningStatus.currentTime);
    setCurrentVolume(songRunningStatus.volume || 100);
    setSpeed(songRunningStatus.speed);
    setIsPlaying(songRunningStatus.status === "play" ? true : false);
  }, [song]);

  // update mode
  useEffect(() => {
    if (!songRunningStatus || !socket || !user) return;
    const clientTime = new Date();
    const runningStatus: SongRunningStatusType = {
      currentTime,
      speed,
      volume: currentVolume,
      status: isPlaying ? "play" : "pause",
    };

    const data: wsClientUpdateModeType = {
      type: "update-mode",
      createTime: clientTime,
      roomId: user.roomId,
      payload: {
        runningStatus,
      },
    };

    wsSendMsg(socket, data);
  }, [socket, user, currentVolume]);

  // Control Mode
  useEffect(() => {
    if (!songRunningStatus || !socket || !user) return;
    const clientTime = new Date();
    const runningStatus: SongRunningStatusType = {
      currentTime,
      speed,
      volume: currentVolume,
      status: isPlaying ? "play" : "pause",
    };

    const data: wsClientControlModeType = {
      type: "control-mode",
      createTime: clientTime,
      roomId: user.roomId,
      payload: {
        runningStatus,
      },
    };

    wsSendMsg(socket, data);
  }, [socket, user, isPlaying, speed]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => {
      if (!audioRef.current) return prev;

      prev ? audioRef.current.pause() : audioRef.current.play();
      audioRef.current.volume = 0;
      return !prev;
    });
  }, []);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  if (!song) {
    return <div className="text-center">Search a song</div>;
  }

  return (
    <div className="w-full h-full max-w-md mx-auto bg-background shadow-lg rounded-lg">
      <div className="relative h-[17rem] w-full">
        <Image
          src={song.image[song.image.length - 1].url}
          alt={song.name}
          fill
          unoptimized
        />
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">{song.name}</h2>
        <p className="text-muted-foreground mb-4">
          {song.artists.map((artist) => artist.name).join(", ")} • {song.year}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={song.duration}
            step={1}
            className="w-full mx-2"
            onValueChange={(value) => {
              if (audioRef.current) {
                audioRef.current.currentTime = value[0];
              }
            }}
          />
          <span className="text-sm">{formatTime(song.duration)}</span>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <Button size="icon" onClick={togglePlayPause}>
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
        </div>
        <div className="mt-4 flex items-center">
          <Volume2 className="h-5 w-5 mr-2" />
          <Slider
            max={100}
            step={1}
            value={[currentVolume]}
            className="w-full"
            onValueChange={(value) => {
              if (audioRef.current) {
                setCurrentVolume(value[0]);
              }
            }}
          />
        </div>
      </div>
      <audio
        ref={audioRef}
        loop
        src={song.downloadUrl[song.downloadUrl.length - 1].url}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          setCurrentTime(audio.currentTime);

          const runningStatus: SongRunningStatusType = {
            currentTime: audio.currentTime,
            speed: audio.playbackRate,
            volume: currentVolume,
            status: isPlaying ? "play" : "pause",
          };
          setSongRunningStatus(runningStatus);
        }}
      />
    </div>
  );
}
