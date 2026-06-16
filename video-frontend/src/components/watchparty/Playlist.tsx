import { useEffect, useState } from "react";
import {
    type SocketProps,
    type PlaylistItem,
} from "./type";

function extractVideoId(url: string) {
    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\/]+)/
    );

    return match?.[1] ?? null;
}

export default function Playlist({
    sendJsonMessage,
    lastJsonMessage,
}: SocketProps) {
    const [playlist, setPlaylist] =
        useState<PlaylistItem[]>([]);

    const [videoId, setVideoId] =
        useState("");

    useEffect(() => {
        if (!lastJsonMessage) return;

        if (
            lastJsonMessage.action ===
            "playlist_add"
        ) {
            
        setPlaylist(prev => [
        ...prev,
        {
            video_id: lastJsonMessage.video_id,
            title: lastJsonMessage.title,
            index: lastJsonMessage.index,
        },
    ]);
        }
    }, [lastJsonMessage]);

    useEffect(() => {
    console.log(lastJsonMessage);
}, [lastJsonMessage]);

    const selectVideo = (video: PlaylistItem) => {
        console.log("CLICKED", video);
    sendJsonMessage({
        action: "loadVideo",
        data: {
            type: "youtube",
            video_id: video.video_id,
            title: video.title,
        },
    });
};

    const handleAdd = () => {
        if (!videoId.trim()) return;
        const id = extractVideoId(videoId);

        if (!id) {
            console.error("Invalid YouTube URL");
            return;
        }

        sendJsonMessage({
            action: "addToPlaylist",
            data: {
                video_id: id,
            },
        });

        setVideoId("");
    };

    console.log("playlist state", playlist);
    return (
        <div>
            <h3>Playlist</h3>
            {playlist.map((video) => (
            <div
                key={video.index}
                onClick={() => selectVideo(video)}
                
            >
                
                {video.title}
            </div>
        ))}

            <input
                value={videoId}
                onChange={(e) =>
                    setVideoId(e.target.value)
                }
                placeholder="Video ID"
            />

            <button onClick={handleAdd}>
                Add
            </button>
        </div>
    );
}