import { useRef, useEffect, useCallback, useState } from "react";
import YouTube from "react-youtube";



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

export default function YoutubePlayer({src, remoteCommand}: Props) {

    const [playerReady, setPlayerReady] = useState(false);
    
    const playerRef = useRef<any>(null);
    

    const onPlayerReady = useCallback( (event: any) => {
        playerRef.current = event.target;
        console.log(playerRef.current)
    }, []);


    useEffect(() => {
        if(!remoteCommand) return;
        // console.log(playerRef)

        switch(remoteCommand.action) {
            case 'play':
                playerRef.current?.playVideo();
                break;
            case "pause":
                playerRef.current?.pauseVideo();
                break;
            case "seek":
                playerRef.current?.seekTo(
                   remoteCommand.data?.current_time,
                   true
                );
                break;

            case "sync":
                playerRef.current?.getCurrentTime()

                break;

            case "give_time":
                playerRef.current?.seekTo(
                );
                break;
        }

    }, [remoteCommand, onPlayerReady])

    

    return (
    <><YouTube 
        videoId={src} 
        onReady={onPlayerReady}/>
        <button onClick={() => playerRef.current?.playVideo()}> Play </button>
        <button onClick={() => playerRef.current?.pauseVideo()}>
            Pause
        </button>

        {/* <button onClick={() => playerRef.current?.seekTo(60)}>
            Seek 60s
        </button> */}
    </>


)
}