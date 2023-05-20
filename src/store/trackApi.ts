import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Genre } from "genre-quiz/constants/genres";
import { TrackAPIResponse } from "genre-quiz/types";

export const trackApi = createApi({
  reducerPath: "trackApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    fetchTracksForGenres: builder.query<TrackAPIResponse, Genre[]>({
      query: (genres) => {
        return { url: `tracks`, params: { genres } };
      },
    }),
  }),
});

export const { fetchTracksForGenres } = trackApi.endpoints;
