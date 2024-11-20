"use server";

import { SongDetailType, songSuggestionResponseType } from "@repo/types";

export async function searchSong(name: string) {
  if (!name.length)
    return [];

  const url = `${process.env.SONG_SERVER}/api/search/songs?limit=10&query=${name}`;

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

  return result as unknown as SongDetailType[];
}

export async function searchSongById(id: string) {
  if (!id.length) return {};

  const url = `${process.env.SONG_SERVER}/api/songs/${id}`;

  const response = await fetch(url);
  const body = await response.json();

  if (!body.success)
    return;

  const result = body.data[0];

  const data = {
    id: result.id,
    name: result.name,
    year: result.year,
    duration: result.duration,
    playCount: result.playCount,
    language: result.language,
    artists: result.artists.primary,
    image: result.image,
    downloadUrl: result.downloadUrl
  }
  return data;
}

export async function suggestedSong() {
  const url = `https://www.jiosaavn.com/api.php?__call=content.getTopSearches&ctx=web6dot0`;

  const response = await fetch(url);
  const body: songSuggestionResponseType[] = await response.json();

  const song = body.filter((each) => each.type === "song")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const batch: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];

  song.forEach((each) => {
    const x = searchSongById(each.id);
    batch.push(x);
    x.then(data => result.push(data));
  })
  await Promise.all(batch);

  return result as unknown as SongDetailType[];
}