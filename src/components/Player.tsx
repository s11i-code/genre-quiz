interface Props {
  trackId: string;
}

export default function Player({ trackId }: Props) {
  // min height 150px comes from the Spotify widget default: height
  // it's added to prevent layout shift
  return (
    <div className="flex justify-center pt-4" style={{ minHeight: "150px" }}>
      <iframe
        style={{ borderRadius: "12px" }}
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        loading="lazy"
      ></iframe>
    </div>
  );
}
