// playback hook
// useHlsPlayer
/*
attach manifest
listen for player events
expose loading/error state
*/ 

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";



function useHlsPlayer(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  src: string
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const setQuality = (lvl:number) => {
    console.log("forcing level", lvl)
        if (hlsRef.current) {
          hlsRef.current.currentLevel = lvl;
          // hlsRef.current.loadLevel = lvl;
          // hlsRef.current.nextLevel = lvl;
          hlsRef.current.autoLevelCapping= lvl;
          
          console.log(hlsRef.current?.currentLevel)
        }
  }
  // const setAutoQuality = () => {
  //       if (hlsRef.current) {
  //         hlsRef.current.loadLevel = -1;
  //         hlsRef.current.nextLevel = -1;
  //         hlsRef.current.autoLevelCapping= -1;
  //       }
  // } 


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    console.log(videoRef.current);

    let hls: Hls | null = null;
    hlsRef.current = hls
    

    setLoading(true);
    setError(null);


    // Native HLS support (Safari)
    if (!video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;

      console.log("native path");

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
      console.log("hoopspspspspspsp");
      console.log("Registering HLS listeners");

      

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Levels:", hls?.levels);
        console.log("Count:", hls?.levels.length);
        console.log("Manifest loaded");
        setLoading(false);
        console.log("Available levels:");


        hls?.levels.forEach((level, i) => {
          console.log(
            i,
            level.height + "p",
            level.bitrate
          );
        });
      });

      hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
        console.log("Level loaded:", data.level);
      });
      hls.on(Hls.Events.FRAG_CHANGED, (_, data) => {
              console.log(
            "Playing fragment at level:",
            data.frag.level
          );
      });

      hls?.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        console.log("Switched to level:", data.level);

        const level = hls?.levels[data.level];

        console.log("Resolution:", level?.height + "p")
        console.log("Bitrate:", level?.bitrate);
      })

      hls?.on(Hls.Events.ERROR, (_, data) => {
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

      hls.loadSource(src);
      hls.attachMedia(video);
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

  return { loading, error,  setQuality,  /*setAutoQuality*/ };
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