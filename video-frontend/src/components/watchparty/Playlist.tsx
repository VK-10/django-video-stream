import { useEffect, useState } from "react";
import {
    type SocketProps,
    type PlaylistItem,
} from "./type";

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
            "playlist_updated"
        ) {
            setPlaylist(
                lastJsonMessage.playlist
            );
        }
    }, [lastJsonMessage]);

    const handleAdd = () => {
        if (!videoId.trim()) return;

        sendJsonMessage({
            action: "playlist_add",
            data: {
                video_id: videoId,
            },
        });

        setVideoId("");
    };

    return (
        <div>
            <h3>Playlist</h3>

            {playlist.map((video, index) => (
                <div key={index}>
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