import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { GAME_LENGTH } from "genre-quiz/constants";
import {
  Genre,
  Track,
  GENRES,
  TrackAPISuccessResponse,
  isTrackAPISuccessResponse,
} from "genre-quiz/types";
import { fetchTracksForGenres } from "genre-quiz/store/trackApi";
import { random } from "genre-quiz/utils/array";
import { RootState } from "genre-quiz/store";

export interface GameState {
  tracks: TrackAPISuccessResponse["tracks"];
  answeredGenres: Record<string, Genre>;
  currentPageIndex: number;
  loading: boolean;
}

export const initializeGenreData = createAsyncThunk(
  "users/fetchByIdStatus",
  async (_, thunkAPI) => {
    const correctGenres = getRandomGenres();
    const response = await thunkAPI.dispatch(
      fetchTracksForGenres.initiate(correctGenres)
    );

    if (response.data && isTrackAPISuccessResponse(response.data)) {
      return response.data;
    } else {
      return thunkAPI.rejectWithValue(response);
    }
  }
);

const initialState: GameState = {
  tracks: [],
  currentPageIndex: 0,
  answeredGenres: {},
  loading: false,
};

const gameStateSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    addAnswer(
      state: GameState,
      { payload }: PayloadAction<{ pageIndex: number; genre: Genre }>
    ) {
      const { pageIndex, genre } = payload;
      state.answeredGenres[pageIndex] = genre;
    },
    incrementPageIndex(state: GameState) {
      state.currentPageIndex++;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeGenreData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(initializeGenreData.fulfilled, (state, { payload }) => {
      state.tracks = payload.tracks;
      state.loading = false;
    });
    builder.addCase(initializeGenreData.rejected, (state, action) => {
      console.error("Error fetching tracks", action);
      state.loading = false;
    });
  },
});

function getRandomGenres(): Genre[] {
  return Array.from(Array(GAME_LENGTH)).map(() => random(GENRES));
}

export const { addAnswer, incrementPageIndex } = gameStateSlice.actions;

export const isInitialized = createSelector(
  [({ gameState }: RootState) => gameState.tracks],
  (tracks) => {
    return tracks.length > 0;
  }
);

export const isFinished = createSelector(
  [({ gameState }: RootState) => gameState.currentPageIndex],
  (pageIndex) => pageIndex > GAME_LENGTH - 1
);

export default gameStateSlice.reducer;
