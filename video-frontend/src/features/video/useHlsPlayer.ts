// playback hook
// useHlsPlayer
/*
attach manifest
listen for player events
expose loading/error state
*/ 

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

type Level = {
  index: number;
  height: number;
  bitrate: number;
};

function useHlsPlayer(
  videoRef: React.RefObject<HTMLVideoElement>,
  src: string
) {
  const hlsRef = useRef<Hls | null>(null);

  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 = auto
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setQuality = (lvl: number) => {
    if (!hlsRef.current) return;
    hlsRef.current.currentLevel = lvl;
    setCurrentLevel(lvl);
  };

  const setAutoQuality = () => {
    if (!hlsRef.current) return;
    hlsRef.current.currentLevel = -1;
    setCurrentLevel(-1);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    console.log("videRef", video)

    setLoading(true);
    setError(null);

    let hls: Hls | null = null;

    // Safari (native HLS)
    if (!video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;

      video.onloadedmetadata = () => setLoading(false);
      video.onerror = () => {
        setError("Failed to load stream.");
        setLoading(false);
      };

      return;
    }

    // HLS.js path
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      // manifest parsed → levels available
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const parsedLevels = hls!.levels.map((l, i) => ({
          index: i,
          height: l.height,
          bitrate: l.bitrate,
        }));

        setLevels(parsedLevels);
        setLoading(false);
      });

      // error handling
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              setError("Playback failed.");
          }
        }
      });

      return () => {
        hls?.destroy();
        hlsRef.current = null;
      };
    }

    // unsupported browser
    setError("HLS not supported.");
    setLoading(false);
  }, [src]);

  return {
    levels,
    currentLevel,
    loading,
    error,
    setQuality,
    setAutoQuality,
  };
}

export default useHlsPlayer;