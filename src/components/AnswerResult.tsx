import { GENRE_WIKIPEDIA_ENTRIES, Genre } from "genre-quiz/constants/genres";
import { capitalize } from "genre-quiz/utils/string";

export function AnswerResult({
  correctGenre,
  answeredGenre,
  trackId,
}: {
  answeredGenre: Genre;
  correctGenre: Genre;
  trackId: string;
}) {
  const resultText =
    correctGenre == answeredGenre
      ? `${capitalize(correctGenre)} was correct!`
      : `Not ${answeredGenre} – this was ${correctGenre}`;

  const wikipediaId = GENRE_WIKIPEDIA_ENTRIES[correctGenre];
  return (
    <section className="pt-4">
      <h2 className="text-lg font-semibold pb-2">{resultText}</h2>
      <p className="">
        {wikipediaId && (
          <span>
            Read more about the genre on its{" "}
            <a
              target="blank"
              className="link"
              href={wikipediaLink(wikipediaId)}
            >
              Wikipedia page.
            </a>
          </span>
        )}{" "}
        You can see more genres attached to this song on this{" "}
        <a className="link" target="blank" href={chosicLink(trackId)}>
          page.
        </a>
      </p>
    </section>
  );
}

function wikipediaLink(wikipediaId: string) {
  return `https://en.wikipedia.org/wiki/${wikipediaId}`;
}

function chosicLink(trackId: string) {
  return `https://www.chosic.com/music-genre-finder/?track=${trackId}`;
}
