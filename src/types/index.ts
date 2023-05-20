import { Genre } from "genre-quiz/constants/genres";

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
