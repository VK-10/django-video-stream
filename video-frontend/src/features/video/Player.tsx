import { useRef, useState } from "react";
import useHlsPlayer from "./useHlsPlayer";

type Props = {
  src: string;
};

export default function VideoPlayer({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    levels,
    currentLevel,
    loading,
    error,
    setQuality,
    setAutoQuality,
  } = useHlsPlayer(videoRef, src);

  const [isBuffering, setIsBuffering] = useState(false);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-3">
      {loading && <p>Loading stream...</p>}
      {isBuffering && <p>Buffering...</p>}

      <video
        ref={videoRef}
        controls
        className="w-full rounded-xl"
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
      />

      {/* Quality Controls */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={setAutoQuality}>
          Auto {currentLevel === -1 && "✓"}
        </button>

        {levels.map((level) => (
          <button
            key={level.index}
            onClick={() => setQuality(level.index)}
          >
            {level.height}p{" "}
            {currentLevel === level.index && "✓"}
          </button>
        ))}
      </div>
    </div>
  );
}