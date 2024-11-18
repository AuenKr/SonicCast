import { SearchBar } from "@/components/searchBar";
import { SongPlayer } from "@/components/songPlayer";

export default async function AdminUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div className="flex flex-col items-center gap-2 mt-5">
      <div className="gap-2 flex flex-col text-center">
        <span className="font-bold">Admin Section</span>
        <div>Room Id : {id}</div>
      </div>
      <div className="w-full max-w-lg">
        <SearchBar />
      </div>
      <div className="w-full max-w-md h-[70vh]">
        <SongPlayer />
      </div>
    </div>
  );
}
