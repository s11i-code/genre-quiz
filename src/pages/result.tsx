import { GAME_LENGTH } from "genre-quiz/constants";
import { RootState } from "genre-quiz/store";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function ResultPage() {
  const { answeredGenres, tracks } = useSelector(
    ({ gameState }: RootState) => gameState
  );

  const numCorrect = tracks.reduce<number>((total, track, index) => {
    return track.genre === answeredGenres[index] ? total + 1 : total;
  }, 0);
  return (
    <section className="text-center">
      <h1 className="text-2xl bold">You reached the end!</h1>
      <p className="py-10">
        Your score was {numCorrect} / {GAME_LENGTH}.
      </p>

      <Link href="/" className="btn">
        Start Over
      </Link>
    </section>
  );
}
