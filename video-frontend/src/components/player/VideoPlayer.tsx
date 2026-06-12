import { useEffect, useRef } from "react";
import Hls from "hls.js";

type Props = {
    src: string;
    autoPlay?: boolean;
    controls?: boolean;
    width?: number | string;
    height?: number | string;

    //watchparty specs
    remoteCommand?: {
        action?: string;
        type?: string;
        [key: string]: unknown
    } | null;
}



export default function VideoPlayer({ src, autoPlay = false, remoteCommand} : Props) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!videoRef.current  || !src) return;

        const video = videoRef.current;

        if(video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            if (autoPlay) video.play();
            return;
        }

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });

            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (autoPlay) video.play();
            })

            hls.on(Hls.Events.ERROR, (_, data)=> {
                console.error("HLS error", data);

                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                        console.warn("Network error → retrying...");
                        hls.startLoad();
                        break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                        console.warn("Media error → recovering...");
                        hls.recoverMediaError();
                        break;

                        default:
                        hls.destroy();
                        break;
                    }
                }
            });

            return () => {
                hls.destroy();
            };
        }
    }, [src, autoPlay]);


    //adding functionality for recieveing websocket hook
    useEffect(() => {
    if (!remoteCommand) return;

    switch(remoteCommand.action) {
        case "play":
            videoRef.current?.play();
            break;

        case "pause":
            videoRef.current?.pause();
            break;
    }
}, [remoteCommand]);

    return (
    <video
      ref={videoRef}
      controls
      className="w-full rounded-xl bg-black"
    />
  );
}