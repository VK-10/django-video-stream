/*route-level UI*/

import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import VideoPlayer from "../features/video/Player";
import {getVideoById} from "../services/videoService";
import VideoCard from "../components/VideoCard";

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
                setVideo(Array.isArray(data) ? data[0] : data);
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
      <div className="max-w-5xl mx-auto  px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Player + Info */}
    <div className="lg:col-span-2 space-y-4">
      <VideoPlayer src={video.manifest_url} />

      <h1 className="text-xl font-semibold">{video.title}</h1>

      <div className="flex items-center justify-between text-sm text-gray-400">
        {/* <span>{video.views || "0"} views</span> */}
        <span>•</span>
        <span>Recently uploaded</span>
      </div>
    </div>

        {/* RIGHT: Related Videos */}
    {/* <div className="space-y-4">
      {videos.map(v => (
        <VideoCard key={v.id} video={v} compact />
      ))}
    </div> */}

      </div>
    </div>
  );
}