import Player from "genre-quiz/components/Player";
import { RootState } from "genre-quiz/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import GenreOptions from "genre-quiz/components/connected/GenreOptions";
import NextTrackLink from "genre-quiz/components/connected/NextTrackLink";
import { GAME_LENGTH } from "genre-quiz/constants";
import { AnswerResult } from "genre-quiz/components/AnswerResult";

function useGameStateLogic() {
  const { tracks, currentPageIndex } = useSelector(
    (state: RootState) => state.gameState
  );
  const isInitialized = tracks.length > 0;
  const isFinished = currentPageIndex > GAME_LENGTH - 1;
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      router.push("/");
    }
    if (isFinished) {
      router.push("/result");
    }
  }, [isInitialized, router, isFinished]);
  return { isInitialized, isFinished };
}

export default function PlayerPage() {
  const { currentPageIndex, answeredGenres, tracks } = useSelector(
    (state: RootState) => state.gameState
  );
  const track = tracks[currentPageIndex];

  const { isInitialized, isFinished } = useGameStateLogic();
  if (!isInitialized || isFinished) {
    return null;
  }

  const { genre: correctGenre, id: trackId } = track;
  const answeredGenre = answeredGenres[currentPageIndex];

  return (
    <div className="min-h-screen flex-1	">
      {/* Page: {currentPageIndex} <br />
      Correct: {correctGenre} <br />
      Answered:{answeredGenre} <br />
      TrackId: {trackId} */}

      {trackId ? (
        <Player trackId={trackId} />
      ) : (
        <p>No track found for genre ${correctGenre} </p>
      )}
      {answeredGenre && (
        <AnswerResult
          isCorrect={correctGenre === answeredGenre}
          trackId={trackId}
        />
      )}
      <div className="pt-12 text-right">
        {!track || answeredGenre ? (
          <NextTrackLink />
        ) : (
          <GenreOptions correctGenre={correctGenre} />
        )}
      </div>
    </div>
  );
}
