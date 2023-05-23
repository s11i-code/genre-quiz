import {
  Action,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { GAME_LENGTH } from "genre-quiz/constants";
import {
  TrackAPISuccessResponse,
  isTrackAPISuccessResponse,
} from "genre-quiz/types";
import { fetchTracksForGenres } from "genre-quiz/store/trackApi";
import { random } from "genre-quiz/utils/array";
import { RootState } from "genre-quiz/store";
import { Genre, GENRES } from "genre-quiz/constants/genres";
import { PersistedStore } from "genre-quiz/utils/persistState";

export interface GameState {
  tracks: TrackAPISuccessResponse["tracks"];
  answeredGenres: Record<string, Genre>;
  currentPageIndex: number;
  loading: boolean;
}

const initialState: GameState = {
  tracks: [],
  currentPageIndex: 0,
  answeredGenres: {},
  loading: false,
};

export const fetchTrackData = createAsyncThunk(
  "initialize/genreData",
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

const slice = createSlice({
  name: "gameState",
  initialState: initialState,
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

    replaceState(state: GameState, { payload }: PayloadAction<GameState>) {
      return payload;
    },

    clearState(state: GameState) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTrackData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTrackData.fulfilled, (state, { payload }) => {
      state.tracks = payload.tracks;
      state.loading = false;
    });
    builder.addCase(fetchTrackData.rejected, (state, action) => {
      console.error("Error fetching tracks", action);
      state.loading = false;
    });
  },
});

export default slice.reducer;

export const { addAnswer, incrementPageIndex, replaceState, clearState } =
  slice.actions;

export const persistedStore = new PersistedStore<GameState>("gameState");

export const persistGameStateMiddleware =
  (store: any) => (next: Function) => (action: Action) => {
    //NOTE: apply action first so the state is then mutated:
    const response = next(action);
    const storeAfterActionApplied = store.getState();
    const tracks = selectTracks(storeAfterActionApplied);

    if (action.type.includes(slice.name) && gameIsPlayable(tracks)) {
      persistedStore.saveInLocalStorage(store.getState()[slice.name]);
    }
    return response;
  };

// SELECTORS:

export const selectCurrentPageIndex = (state: RootState) =>
  state.gameState.currentPageIndex;

export const selectTracks = (state: RootState) => state.gameState.tracks;

export const selectAnsweredGenres = (state: RootState) =>
  state.gameState.answeredGenres;

export const selectLoading = (state: RootState) => state.gameState.loading;

type LifeCyclePhase = "store-initialized" | "loading" | "finished" | "playable";

export const selectGameLifeCyclePhase = createSelector(
  selectCurrentPageIndex,
  selectTracks,
  selectLoading,
  (pageIndex, tracks, isLoading) => {
    let phase: LifeCyclePhase = "store-initialized";
    if (isLoading) {
      phase = "loading";
    } else if (pageIndex > GAME_LENGTH - 1) {
      phase = "finished";
    } else if (gameIsPlayable(tracks)) {
      phase = "playable";
    }

    return phase;
  }
);

// HELPERS

function getRandomGenres(): Genre[] {
  return Array.from(Array(GAME_LENGTH)).map(() => random(GENRES));
}

function gameIsPlayable(tracks: GameState["tracks"]) {
  return tracks !== initialState.tracks;
}
