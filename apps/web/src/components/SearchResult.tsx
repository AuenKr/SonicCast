import { SearchResultType } from "@/utils/type";
import Image from "next/image";

export function SearchResultBox({ song }: { song: SearchResultType }) {
  return (
    <div className="button flex w-full gap-2 items-center m-2 rounded-md cursor-pointer">
      <Image
        src={song.image[0].url}
        alt={song.name}
        width={50}
        height={50}
        className="size-11 flex-grow-0 border rounded-full object-contain"
      />
      <div className="flex-grow flex flex-col w-full gap-2 items-center justify-center">
        <span className="w-full">
          <span>
            <span>{song.name} &#40; </span>
            <span>
              {Math.round(song.playCount / 1000000) > 0
                ? Math.round(song.playCount / 1000000) + "M"
                : Math.round(song.playCount / 1000) + "K"}{" "}
              Views &#41;
            </span>
          </span>
        </span>
        <span className="w-full">
          <span className="capitalize">{song.year} · </span>
          <span className="capitalize">{song.language} · </span>
          <span>
            {`${Math.floor(song.duration / 60)}:${song.duration % 60}`}
          </span>
          <span>
            {song.artists.map((each) => (
              <span key={each.id}> · {each.name}</span>
            ))}
          </span>
        </span>
      </div>
    </div>
  );
}

export function SearchResultBoxShadow() {
  return (
    <div className="flex w-full gap-2 items-center animate-pulse bg-slate-950 m-2 rounded-md">
      <div className="animate-pulse size-11 flex-grow-0 border p-2 rounded-full bg-slate-900"></div>
      <div className="flex-grow flex flex-col w-full gap-2 items-center justify-center">
        <span className="animate-pulse h-4 w-full border p-3 bg-slate-900"></span>
        <span className="animate-pulse h-4 w-full border p-3 bg-slate-900"></span>
      </div>
    </div>
  );
}
