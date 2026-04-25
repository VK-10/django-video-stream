import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import useHlsPlayer from "./useHlsPlayer";

type Props = {
  src: string;
};

export default function VideoPlayer({ src }: Props) {
    const videoRef = useRef<HTMLVideoElement | null > (null);
    const {loading , error } = useHlsPlayer(videoRef,src)

  if (error) {
    return (
      <p>{error}</p>
    );
  }

  return (
    <>
      {loading && <p>Loading stream...</p>}

      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        style={{ width: "80%" }}
      />
    </>
  );
}