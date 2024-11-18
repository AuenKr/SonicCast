"use server";

import { SearchResultType } from "@/utils/type";

export async function searchSong(query: string) {
  const url = `${process.env.SONG_SERVER}/api/search/songs?limit=10&query=${query}`;

  const response = await fetch(url);
  const body = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = body.data.results.map((each: any) => {
    const data = {
      id: each.id,
      name: each.name,
      year: each.year,
      duration: each.duration,
      playCount: each.playCount,
      language: each.language,
      artists: each.artists.primary,
      image: each.image,
      downloadUrl: each.downloadUrl
    }
    return data;
  })

  return result as unknown as SearchResultType[];
}
