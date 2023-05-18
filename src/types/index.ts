export const GENRES = [
  "breakbeat",
  "dance",
  "deep-house",
  "detroit-house",
  "chicago-house",
  "progressive-house",
  "drum-and-bass",
  "dub",
  "dubstep",
  "edm",
  "electro",
  "hardstyle",
  "house",
  "idm",
  "minimal-techno",
  "post-dubstep",
  "techno",
  "detroit-techno",
  "trance",
  "trip-hop",
  "electronica",
] as const;
export type Genre = (typeof GENRES)[number];

export interface Track {
  id: string;
  name: string;
  genre: Genre;
}

export interface TrackAPIErrorResponse {
  message: string;
}

export interface TrackAPISuccessResponse {
  tracks: Track[];
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
