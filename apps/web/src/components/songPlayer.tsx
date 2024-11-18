"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { songDetailAtom } from "@/state/atom/songAtom";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function SongPlayer() {
  const song = useAtomValue(songDetailAtom);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(100);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", updateTime);

    return () => audio.removeEventListener("timeupdate", updateTime);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  if (!song) {
    return <div>Search a song</div>;
  }

  return (
    <div className="w-full h-full max-w-md mx-auto bg-background shadow-lg rounded-lg overflow-hidden">
      <div className="relative h-64 w-full">
        <Image
          src={song.image[song.image.length - 1].url}
          alt={song.name}
          layout="fill"
          objectFit="cover"
          sizes="100%"
          priority={false}
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
          <Button size="icon" variant="ghost">
            <SkipBack className="h-6 w-6" />
          </Button>
          <Button size="icon" onClick={togglePlayPause}>
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
          <Button size="icon" variant="ghost">
            <SkipForward className="h-6 w-6" />
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
                audioRef.current.volume = value[0] / 100;
              }
            }}
          />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={song.downloadUrl[song.downloadUrl.length - 1].url}
      />
    </div>
  );
}
