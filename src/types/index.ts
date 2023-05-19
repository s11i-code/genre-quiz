export const GENRES = [
  //"breakbeat",
  //"detroit-techno",
  //"chicago-house",
  "electro-pop",
  "deep-house",
  "detroit-house",
  "progressive-house",
  "drum-and-bass",
  "dubstep",
  "edm",
  "hardstyle",
  "house",
  "idm",
  "minimal-techno",
  "techno",
  "trance",
  "trip-hop",
  "uk-garage",
] as const;
export type Genre = (typeof GENRES)[number];

export interface Track {
  id: string;
  name: string;
  genre: Genre;
}

// this is needed because the API may return null for a track if the playlist isn't found etc.
type TrackOrNotFound = Track | { genre: Genre };
export interface TrackAPIErrorResponse {
  message: string;
}

export interface TrackAPISuccessResponse {
  tracks: TrackOrNotFound[];
}

export type TrackAPIResponse = TrackAPIErrorResponse | TrackAPISuccessResponse;

export function isTrackAPISuccessResponse(
  resp: TrackAPIResponse
): resp is TrackAPISuccessResponse {
  return "tracks" in resp;
}

// TODO remove if not needed
interface WikipediaResponse {
  sourceLanguage: string;
  title: string;
  revision: string;
  segmentedContent: string;
}
