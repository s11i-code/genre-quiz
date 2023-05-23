import { AppDispatch } from "genre-quiz/store";
import {
  selectGameLifeCyclePhase,
  persistedStore,
  replaceState,
  fetchTrackData,
} from "genre-quiz/store/gameStateSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export function useGameLifeCycle() {
  const phase = useSelector(selectGameLifeCyclePhase);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (phase === "finished") {
      router.push("/result");
    }

    if (phase === "store-initialized") {
      const prevGame = persistedStore.loadFromLocalStorage();
      if (prevGame) {
        dispatch(replaceState(prevGame));
      } else {
        dispatch(fetchTrackData());
      }
    }
  }, [phase, router, dispatch]);
  return phase;
}
