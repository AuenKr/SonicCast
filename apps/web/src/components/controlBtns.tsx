"use client";
import { Keyboard } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback, useRef, useState } from "react";
import { Input } from "./ui/input";
import { generateRoomId, isValidRoomId } from "@/utils";
import { useRouter } from "next/navigation";

export default function ControlBtn() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>();

  const handleCreateRoom = useCallback(() => {
    const roomId = generateRoomId();
    router.push(`/${roomId}/admin`);
  }, [router]);

  const handleJoinRoom = useCallback(() => {
    const roomId = inputRef.current && inputRef.current.value;

    if (!roomId || !isValidRoomId(roomId)) {
      setError("Invalid room id");
      return;
    }

    router.push(`/${roomId}/user`);
  }, [router]);

  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-5">
      <div className="col-span-1 md:col-span-2 w-full flex justify-center items-center">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-500 dark:text-slate-100"
          onClick={handleCreateRoom}
        >
          Create New Room
        </Button>
      </div>
      <div className="col-span-1 w-full flex items-center justify-center font-bold">
        Or
      </div>
      <div className="col-span-1 md:col-span-2 space-y-2">
        <div className="w-full relative">
          <Keyboard className="absolute left-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 text-gray-500" />
          <Input
            name="meetId"
            placeholder="Enter meet code"
            ref={inputRef}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-10 md:min-w-28"
          />
        </div>
        <div className="text-center font-bold text-red-500">{error}</div>
        <Button
          className="w-full inline-block"
          onClick={handleJoinRoom}
          variant="secondary"
        >
          Join
        </Button>
      </div>
    </div>
  );
}
