import { incrementPageIndex } from "genre-quiz/store/gameStateSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";

export default function NextTrackLink() {
  const dispatch = useDispatch();
  return (
    <Link
      onClick={() => {
        dispatch(incrementPageIndex());
      }}
      className="btn"
      href="/player"
    >
      Next
    </Link>
  );
}
