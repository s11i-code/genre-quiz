import Player from "genre-quiz/components/Player";
import { useSelector } from "react-redux";
import GenreOptions from "genre-quiz/components/connected/GenreOptions";
import NextTrackLink from "genre-quiz/components/connected/NextTrackLink";
import { AnswerResult } from "genre-quiz/components/AnswerResult";
import {
  selectAnsweredGenres,
  selectCurrentPageIndex,
  selectTracks,
} from "genre-quiz/store/gameStateSlice";
import { useGameLifeCycle } from "genre-quiz/store/hooks";

export default function PlayerPage() {
  const currentPageIndex = useSelector(selectCurrentPageIndex);
  const answeredGenres = useSelector(selectAnsweredGenres);
  const tracks = useSelector(selectTracks);
  const phase = useGameLifeCycle();

  if (phase === "loading") {
    return <span>Loading</span>;
  }

  if (phase !== "playable") {
    return null;
  }

  // using ! here because the lifecycle checks above verify that tracks have been fetched.
  // track should never be undefined (it can be not found though :) ).
  // If it is undefined, it's a bug so let things crash and burn.
  const track = tracks[currentPageIndex];
  const trackId = "id" in track ? track.id : null;
  const { genre: correctGenre } = track;
  const answeredGenre = answeredGenres[currentPageIndex];

  return (
    <div className="min-h-screen flex-1	">
      {trackId ? (
        <Player trackId={trackId} />
      ) : (
        <p>
          No track found for genre {correctGenre} or playlist not accessible.{" "}
        </p>
      )}
      {answeredGenre && trackId && (
        <AnswerResult
          correctGenre={correctGenre}
          answeredGenre={answeredGenre}
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
