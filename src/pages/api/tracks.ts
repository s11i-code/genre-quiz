import { GENRES } from "genre-quiz/types";
import { Genre, TrackAPIResponse, Track } from "genre-quiz/types";
import { intersect, random } from "genre-quiz/utils/array";
import type { NextApiRequest, NextApiResponse } from "next";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "0f68a69b5519484e8495a67db08067d8",
  clientSecret: process.env.GENRE_SPOTTER_CLIENT_SECRET,
});

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
    genres.map((genre) => spotifyApi.searchTracks(`genre:${genre}`, {}))
  );

  const tracks = responses
    .map((resp, index) => {
      const tracksForGenre = resp.body.tracks?.items?.map(
        ({ id, artists, name }) => {
          return { id, name };
        }
      );

      const genre = genres[index];

      if (tracksForGenre && tracksForGenre.length) {
        // select one random track from a pool of search results:
        const randomTrack = random(tracksForGenre || []);

        return { id: randomTrack.id, name: randomTrack.name, genre };
      }

      // null if no tracks we're found.
      return null;
    })
    // drop genres for which no tracks we're found
    // TODO: maybe send {} instead? This would make more sense more API contract POV
    // but lead to more UI emptiness checks
    .filter((t): t is Track => t !== null);

  return res.status(200).json({ tracks });
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
