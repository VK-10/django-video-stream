/*route-level UI*/

import {useEfect, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import VideoPlayer from "../features/video/Player";
import {getVideoById} from "../services/videoService";

type Video = {
    id: string;
    title: string;
    manifest_url: string;
}

export default function Watch() {
    const { id } = useParams();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const data =await getVideoById(id!);
                setVideo(data);
            } catch {
                console.error("Failed to fetch video")
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [id]);

    if (loading) return <p className="p-6">Laoding</p>;
    if (!video) return <p className="p-6"> Video not found</p>;

    return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-6 space-y-4">

        <VideoPlayer src={video.manifest_url} autoPlay />

        <h1 className="text-2xl font-bold">{video.title}</h1>

      </div>
    </div>
  );
}