"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Label } from "./ui/label";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "./ui/input";
import { searchSong, suggestedSong } from "@/actions/song";
import {
  SongDetailType,
  SongRunningStatusType,
  wsClientStateModeType,
} from "@repo/types";
import { songDetailAtom, songRunningStatusAtom } from "@/state/atom/songAtom";
import { SearchResultBox, SearchResultBoxShadow } from "./SearchResult";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useAtomValue, useSetAtom } from "jotai";
import { DialogDescription } from "./ui/dialog";
import { userAtom, userWsConnectionAtom } from "@/state/atom/userAtom";
import { wsSendMsg } from "@/lib";

export function SearchBar() {
  const [input, setInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<SongDetailType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(true);
  const searchContainerRef = useRef<HTMLDivElement>(null); // Ref for the search container

  const setSelectedSong = useSetAtom(songDetailAtom);
  const setSongRunningStatus = useSetAtom(songRunningStatusAtom);
  const user = useAtomValue(userAtom);

  const socket = useAtomValue(userWsConnectionAtom);

  // search suggestions
  useEffect(() => {
    suggestedSong().then((results) => {
      setSearchResult(results);
      setLoading(false);
    });
  }, []);

  // For debouncing search box
  useEffect(() => {
    let x: NodeJS.Timeout;
    if (input.length >= 1) {
      setLoading(true);
      x = setTimeout(async () => {
        const results = await searchSong(input);
        setSearchResult(results);
        setLoading(false);
      }, 300);
    }
    return () => x && clearTimeout(x);
  }, [input]);

  // For Cmd J
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelectedSong = useCallback(
    (song: SongDetailType) => {
      setSelectedSong(song);
      setOpen(false);

      if (!socket || !user) return;

      const clientTime = new Date();
      const runningStatus: SongRunningStatusType = {
        currentTime: 0,
        speed: 1,
        volume: 100,
        status: "pause",
      };
      setSongRunningStatus(runningStatus);

      const data: wsClientStateModeType = {
        type: "control-state",
        createTime: clientTime,
        roomId: user.roomId,
        payload: {
          musicDetail: song,
          runningStatus,
        },
      };

      wsSendMsg(socket, data);
    },
    [setSelectedSong, socket]
  );

  return (
    <div ref={searchContainerRef}>
      <Label
        htmlFor="searchBox"
        className="font-bold text-lg text-center w-full inline-block"
      >
        Search
      </Label>
      <Command>
        <Input onClick={() => setOpen(true)} placeholder="Select a song..." />
        <CommandDialog open={open} onOpenChange={setOpen}>
          <DialogTitle className="text-xl p-2 text-center">
            Search Songs
          </DialogTitle>
          <DialogDescription className="text-center">
            Find your favorite song
          </DialogDescription>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Select a song..."
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandSeparator />
            <CommandGroup>
              {loading
                ? [1, 2, 3].map((each) => {
                    return (
                      <CommandItem key={each} className="w-full">
                        <SearchResultBoxShadow />
                      </CommandItem>
                    );
                  })
                : searchResult.map((each, idx) => {
                    return (
                      <CommandItem key={idx}>
                        <div
                          onClick={() => {
                            handleSelectedSong(each);
                          }}
                        >
                          <SearchResultBox song={each} />
                        </div>
                      </CommandItem>
                    );
                  })}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Command>
    </div>
  );
}
