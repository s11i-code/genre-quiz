import { GENRES } from "genre-quiz/types";
import { Genre } from "genre-quiz/types";

import { shuffle } from "genre-quiz/utils/array";
import { useDispatch, useSelector } from "react-redux";
import { addAnswer } from "genre-quiz/store/gameStateSlice";
import { RootState } from "genre-quiz/store";

export default function GenreOptions({
  correctGenre,
}: {
  correctGenre: Genre;
}) {
  const dispatch = useDispatch();
  const pageIndex = useSelector(
    (state: RootState) => state.gameState.currentPageIndex
  );
  function submitAnswer(genre: Genre) {
    dispatch(addAnswer({ pageIndex, genre }));
  }

  return (
    <ul className="flex flex-col md:flex-row gap-8 justify-center">
      {getGenreOptions(correctGenre).map((genre, index) => {
        return (
          <li key={genre} className="">
            <button
              className="btn w-full h-full"
              onClick={() => submitAnswer(genre)}
            >
              {genre.replace("-", " ")}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function getGenreOptions(correctGenre: Genre): Genre[] {
  if (!correctGenre) {
    return [];
  }

  const nonOverlappingGenres = shuffle(
    // genres are overlapping so
    // prevent situation where e.g. correct genre is "deep house"
    // and "house" is added as one of the "wrong" options (and vice versa)
    GENRES.filter(
      (genre) => !genre.match(correctGenre) && !correctGenre.match(genre)
    )
  );
  return shuffle([
    correctGenre,
    nonOverlappingGenres[0],
    nonOverlappingGenres[1],
  ]);
}
