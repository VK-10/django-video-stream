// playback hook
// useHlsPlayer
/*
attach manifest
listen for player events
expose loading/error state
*/ 

import { useEffect, useState } from "react";
import Hls from "hls.js";

function useHlsPlayer(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  src: string
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    setLoading(true);
    setError(null);

    // Native HLS support (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;

      video.onloadedmetadata = () => {
        setLoading(false);
      };

      video.onerror = () => {
        setError("Failed to load stream.");
        setLoading(false);
      };
    }

    // hls.js fallback
    else if (Hls.isSupported()) {
      hls = new Hls();

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Manifest loaded");
        setLoading(false);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS error:", data);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Recovering network...");
              hls?.startLoad();
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Recovering media...");
              hls?.recoverMediaError();
              break;

            default:
              setError("Playback failed.");
              hls?.destroy();
          }
        }
      });
    }

    // No support at all
    else {
      setLoading(false);
      setError("HLS not supported in this browser.");
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, videoRef]);

  return { loading, error };
}

export default useHlsPlayer;

// function useHlsPlayer(videoRef : React.RefObject<HTMLVideoElement | null>, src : string) {
//    const videoRef = useRef<HTMLVideoElement | null>(null);

//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     let hls: Hls | null = null;

//     setError(null);
//     setLoading(true);

//     if (video.canPlayType("application/vnd.apple.mpegurl")) {
//       video.src = src;

//       video.onloadedmetadata = () => {
//         setLoading(false);
//       };

//       video.onerror = () => {
//         setError("Failed to load stream.");
//         setLoading(false);
//       };
//     }

//     else if (Hls.isSupported()) {
//       hls = new Hls();

//       hls.loadSource(src);
//       hls.attachMedia(video);

//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         console.log("Manifest loaded");
//         setLoading(false);
//       });

//       hls.on(Hls.Events.ERROR, (_, data) => {
//         console.error("HLS error:", data);

//         if (data.fatal) {
//         //   setLoading(false);

//           switch (data.type) {
//             case Hls.ErrorTypes.NETWORK_ERROR:
//                 console.log("Trying network recovery...");
//                 hls.startLoad(); // retry loading
//                 break;

//             case Hls.ErrorTypes.MEDIA_ERROR:
//                 console.log("Trying media recovery...");
//                 hls.recoverMediaError();
//                 break;

//             default:
//               setError("Playback failed.");
//                hls.destroy();
//                 break;
//           }
//         }
//       });
//     }

//     return () => {
//       if (hls) {
//         hls.destroy();
//       }
//     };
//   }, [src]);

// }