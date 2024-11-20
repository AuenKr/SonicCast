"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useAtomValue } from "jotai";
import { songDetailAtom, songRunningStatusAtom } from "@/state/atom/songAtom";

export function UserSongPlayer() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentVolume, setCurrentVolume] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const songDetail = useAtomValue(songDetailAtom);
  const runningStatus = useAtomValue(songRunningStatusAtom);

  const audioRef = useRef<HTMLAudioElement>(null);

  // handle control mode
  useEffect(() => {
    if (!runningStatus) return;
    runningStatus.status === "play" && setIsPlaying(true);
    setSpeed(runningStatus.speed);
    setCurrentTime(runningStatus.currentTime);
  }, [runningStatus?.currentTime, runningStatus?.speed, runningStatus?.status]);

  // Handle control state
  useEffect(() => {
    if (!songDetail || !runningStatus) return;

    setCurrentTime(runningStatus.currentTime);
    setSpeed(runningStatus.speed);
    setIsPlaying(runningStatus.status === "play" ? true : false);
    setCurrentVolume(runningStatus?.volume || 100);
  }, [songDetail]);

  // handle update Mode
  useEffect(() => {
    if (!runningStatus || !audioRef.current) return;

    runningStatus.volume && setCurrentVolume(runningStatus.volume);
    runningStatus.status === "pause" && setIsPlaying(false);
  }, [runningStatus?.status, runningStatus?.volume]);

  // Music controller
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (!audio) return;

      audio.currentTime = currentTime;
      audio.volume = currentVolume / 100;
      audio.playbackRate = speed;
      isPlaying ? audio.play() : audio.pause();
    }
  }, [currentVolume, speed, isPlaying]);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  if (!songDetail || !runningStatus) {
    return <div className="text-center">Waiting for admin to start</div>;
  }
  
  return (
    <div className="w-full h-full max-w-md mx-auto bg-background shadow-lg rounded-lg">
      <div className="relative h-[17rem] w-full">
        <Image
          src={songDetail.image[songDetail.image.length - 1].url}
          alt={songDetail.name}
          fill
          unoptimized
        />
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">{songDetail.name}</h2>
        <p className="text-muted-foreground mb-4">
          {songDetail.artists.map((artist) => artist.name).join(", ")} •{" "}
          {songDetail.year}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={songDetail.duration}
            step={1}
            className="w-full mx-2"
          />
          <span className="text-sm">{formatTime(songDetail.duration)}</span>
        </div>
        <div className="flex justify-center items-center space-x-4"></div>
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
                audioRef.current.volume = value[0] / 100;
              }
            }}
          />
        </div>
      </div>
      <audio
        ref={audioRef}
        loop
        src={songDetail.downloadUrl[songDetail.downloadUrl.length - 1].url}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          setCurrentTime(audio.currentTime);
        }}
      />
    </div>
  );
}
