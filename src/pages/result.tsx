import { GAME_LENGTH } from "genre-quiz/constants";
import {
  clearState,
  persistedStore,
  selectAnsweredGenres,
  selectTracks,
} from "genre-quiz/store/gameStateSlice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

export default function ResultPage() {
  const answeredGenres = useSelector(selectAnsweredGenres);
  const tracks = useSelector(selectTracks);
  const numCorrect = (tracks || []).reduce<number>((total, track, index) => {
    return track.genre === answeredGenres[index] ? total + 1 : total;
  }, 0);
  const router = useRouter();
  const dispatch = useDispatch();

  function handleRestart() {
    dispatch(clearState());
    persistedStore.clearLocalStorage();
    router.push("/player");
  }

  return (
    <section className="text-center ">
      <h1 className="text-2xl bold">You reached the end!</h1>
      <p className="pt-10 pb-14">
        Your score was {numCorrect} / {GAME_LENGTH}.
      </p>

      <button onClick={handleRestart} className="btn">
        Start Over
      </button>
    </section>
  );
}
