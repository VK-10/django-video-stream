import { useEffect, useState } from "react";
import useWatchPartySocket from "./useWatchPartySocket";
import VideoPlayer from "../player/VideoPlayer";
import YoutubePlayer from "./YoutubePlayer";
import Playlist from "./Playlist";
import ChatPanel from "./ChatPanel";




type RoomState = {
    room_id: string;
    room_users: string[];
    current_video: string;
}

export default function WatchParty() {
    const roomId =
        "550e8400-e29b-41d4-a716-446655440000";

    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
    } = useWatchPartySocket(roomId);

    // const [currentVideo, setCurrentVideo] =useState("");
    const [roomState, setRoomState] = useState<RoomState | null>(null);
    const currentVideo = roomState?.current_video;

    // const [messages, setMessages] = useState([]);
    // const [playlist, setPlaylist] = useState([]);

    useEffect(() => {
        if (!lastJsonMessage) return;

        console.log(lastJsonMessage);

        if ("room_id" in lastJsonMessage) {
            setRoomState(lastJsonMessage);
        }

        console.log("MESSAGE", lastJsonMessage);

        if (lastJsonMessage.action === "loadVideo" ){
            setRoomState(prev => {
                if(!prev) return prev;

                return {
                    ...prev,
                    current_video:
                        lastJsonMessage.data
                }
            })
        }
    }, [lastJsonMessage]);

    // if (currentVideo?.type === "youtube") {
    //     return (
    //             <YoutubePlayer
    //                 // videoId={currentVideo.video_id}
    //                 src={"N6CHtrd-WtI"}
    //                 remoteCommand={lastJsonMessage}
    //             />
    //         );

    // }

    const joinRoom = () => {
        sendJsonMessage({
            action: "username",
            username: "vish",
            data: {},
        });
    };

    const playVideo = () => {
        sendJsonMessage({
            action: "play",
            data: {},
        });
    };

    const pauseVideo = () => {
        sendJsonMessage({
            action: "pause",
            data: {},
        });
    };

    const seekVideo = () => {
        sendJsonMessage({
            action: "seek",
            data: {},
        });
    };

    const syncVideo = () => {
        sendJsonMessage({
            action: "sync",
            data: {},
        });
    };
    
   return (
    <div>
        <h1>Watch Party</h1>

        {roomState?.current_video && (
            <YoutubePlayer
                src={roomState.current_video.video_id}
                remoteCommand={lastJsonMessage}
            />
        )}

        <button onClick={joinRoom}>
            Join Room
        </button>

        <p>
            State: {readyState}
        </p>

        <div>
            Users: {roomState?.room_users?.length ?? 0}
        </div>

        <div>
            <button onClick={playVideo}>
                Play
            </button>

            <button onClick={pauseVideo}>
                Pause
            </button>

            <button onClick={seekVideo}>
                Seek
            </button>

            <button onClick={syncVideo}>
                Sync
            </button>
        </div>

        <Playlist
            lastJsonMessage={lastJsonMessage}
            sendJsonMessage={sendJsonMessage}
            playlist={roomState?.playlist ?? []}
        />

        <ChatPanel
            lastJsonMessage={lastJsonMessage}
            sendJsonMessage={sendJsonMessage}
        />
    </div>

);
}