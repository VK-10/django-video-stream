import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import useHlsPlayer from "./useHlsPlayer";

type Props = {
  src: string;
};

export default function VideoPlayer({ src }: Props) {
    const videoRef = useRef<HTMLVideoElement | null > (null);
    const {loading , error, setQuality } = useHlsPlayer(videoRef,src);
    const [isPlaying, setIsPlaying] = useState(false)
    const [isBuffering, setIsBuffering] = useState(false)
    const [playbackState, setPlaybackState] = useState<"idle" | "playing" | "paused" | "ended">("idle");

  if (error) {
    return (
      <p>{error}</p>
    );
  }

  return (
    <>
      {isBuffering && <p>Loading stream...</p>}
       {/* {isBuffering && ...spinner} */}
      <video
        ref={videoRef}
        controls
        onPlay = {() => {
            setIsPlaying(true);
            setIsBuffering(false);
            setPlaybackState("playing");
        }}
        onWaiting={() => {
            setIsBuffering(true)
            console.log("Video is waiting for more data.")
        }}
        onPlaying={() => {
            // resumes after buffering too
            setIsBuffering(false);
            setIsPlaying(true);
            setPlaybackState("playing");
        }}
        onPause={() => {
            setIsPlaying(false);
            setPlaybackState("paused");
        }}
        onEnded={() => {
            setIsPlaying(false);
            setIsBuffering(false);
            setPlaybackState("ended");
        }}
        playsInline
        style={{ width: "80%" }}

      />

     {/* <button onClick={setAutoQuality}>
  Auto
</button> */}

<button onClick={() => setQuality(0)}>
  100p
</button>

<button onClick={() => setQuality(1)}>
  200p
</button>

<button onClick={() => setQuality(2)}>
  350p
</button>

<button onClick={() => setQuality(3)}>
  750p (1.7 Mbps)
</button>

<button onClick={() => setQuality(4)}>
  750p (2.4 Mbps)
</button>
        
      
    </>
  );
}