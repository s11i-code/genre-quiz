import { Genre } from "genre-quiz/types";

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
      ? "Your answer was correct!"
      : `Not correct (${correctGenre} would have been correct)`;

  return (
    <section className="pt-4">
      <h2 className="text-lg font-semibold">{resultText}</h2>
      <p>
        More information about the genre can be found on Wikipedia. You can see
        more genres attached to the song on this{" "}
        <a className="link" target="blank" href={chosicLink(trackId)}>
          page.
        </a>
      </p>
    </section>
  );
}

function chosicLink(trackId: string) {
  return `https://www.chosic.com/music-genre-finder/?track=${trackId}`;
}
