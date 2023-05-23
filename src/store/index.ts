import { configureStore } from "@reduxjs/toolkit";

import gameStateReducer, { persistGameStateMiddleware } from "./gameStateSlice";
import { trackApi } from "genre-quiz/store/trackApi";

export const store = configureStore({
  reducer: {
    gameState: gameStateReducer,
    trackApi: trackApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware()
      .concat(trackApi.middleware)
      .concat(persistGameStateMiddleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
