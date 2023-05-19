import { AppDispatch, RootState } from "genre-quiz/store";
import { initializeGenreData } from "genre-quiz/store/gameStateSlice";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.gameState.loading);

  useEffect(() => {
    dispatch(initializeGenreData());
  }, [dispatch]);

  return (
    <section className="max-w-md">
      <p>
        Test your skills: can you spot the electronic music genre a song belongs
        to?
      </p>

      <p className="py-8">
        Genres and tracks come from Spotify Playlists. One playlist has been
        chosen to represent a genre, and a random track is sampled from it. The
        data may not always be 100% correct and sometimes overlapping genres may
        be present as options.
      </p>

      <p>
        <strong>Note:</strong> if you can&apos;t see the play button in the
        player widget, you need to make sure your browser allows third-party
        cookies. (Or use Safari)
      </p>

      <p className="text-center pt-14">
        <Link className={`btn`} href={loading ? "" : "/player"}>
          Get Started
        </Link>{" "}
      </p>
    </section>
  );
}
