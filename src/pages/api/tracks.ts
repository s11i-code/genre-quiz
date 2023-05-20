import { GENRE_PLAYLIST_IDS } from "genre-quiz/constants";
import { GENRES } from "genre-quiz/types";
import { Genre, TrackAPIResponse, Track } from "genre-quiz/types";
import { intersect, random } from "genre-quiz/utils/array";
import type { NextApiRequest, NextApiResponse } from "next";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "0f68a69b5519484e8495a67db08067d8",
  clientSecret: process.env.GENRE_SPOTTER_CLIENT_SECRET,
});

type SpotifyPlaylistResponse = Awaited<
  ReturnType<typeof spotifyApi.getPlaylist>
>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrackAPIResponse>
) {
  const {
    query: { genres: rawGenres },
  } = req;

  if (!rawGenres) {
    const message = `You must specify a list of genres as a parameter.`;
    return res.status(400).json({ message });
  }

  const genres = parseGenres(rawGenres) as Genre[];

  if (genres.some((genre) => !isGenre(genre))) {
    const message = `Genre is unknown. Accepted values are: ${GENRES.join(
      ", "
    )}. You sent invalid values ${intersect(genres, GENRES).join(", ")}.`;
    return res.status(400).json({ message });
  }

  const accessTokenResponse = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(accessTokenResponse.body["access_token"]);

  const responses = await Promise.all(
    genres.map((genre) => {
      const playlistId = GENRE_PLAYLIST_IDS[genre];
      return spotifyApi.getPlaylist(playlistId).catch((e) => {
        return null;
      });
    })
  );

  const tracks = responses.map((resp, index) => {
    const genre = genres[index];
    const tracksForGenre = parseTracks(resp);

    if (resp === null || !tracksForGenre || tracksForGenre.length === 0) {
      return { genre };
    }

    // select one random track from a pool of search results:
    const randomTrack = random(tracksForGenre || []);

    return { id: randomTrack.id, name: randomTrack.name, genre };
  });

  return res.status(200).json({ tracks });
}

function parseTracks(resp: SpotifyPlaylistResponse | null) {
  return resp?.body?.tracks?.items?.flatMap(({ track }) =>
    track ? [track] : []
  );
}

function isGenre(genre: string): genre is Genre {
  // todo: is there a way to do this without a type assertion?
  return GENRES.includes(genre as Genre);
}

function parseGenres(rawGenres: string | string[]): string[] {
  return Array.isArray(rawGenres)
    ? rawGenres
    : decodeURIComponent(rawGenres).split(",");
}

// async function getArtistGenres(id: string): Promise<string[]> {
//   let doc = await wtf.fetch("Carly Rae Jepsen");
//   if (doc && !Array.isArray(doc)) {
//     const coach = doc.infobox()?.get("Genres");
//     console.log("Genres", doc.infobox());
//   }
// }
