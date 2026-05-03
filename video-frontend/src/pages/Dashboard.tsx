import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getVideos } from "../services/videoService";
import VideoGrid from "../components/VideoGrid";
import type { Video } from "../models/vid-model";
import UploadVideoModal from "../components/Modals/UploadVideoModal";



export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        // console.log("VIDEOS:", data);
        // console.log("TYPE:", typeof data);
        // console.log("IS ARRAY:", Array.isArray(data));
        // console.log("VALUE:", data);
        console.log("RETURNED FROM SERVICE:", data); 
        setVideos(Array.isArray(data) ? data : [])
         console.log("After setVideos:", data); 
      } catch (error) {
        console.error("failed", error);
      } finally {
        setLoading(false)
      }
    };

    fetchVideos();
  }, [])

  console.log("VIDEOS STATE:", videos);
  // console.log("getVideos function:", getVideos.toString());

  const filteredVideos = Array.isArray(videos)
  ? videos.filter(v => v.title.toLowerCase().includes(query.toLowerCase()))
  : [];

 return (
  <div className="flex min-h-screen bg-white">

    {/* Sidebar */}
    <aside className="w-64 border-r hidden md:block p-4 space-y-4">
      <h2 className="font-semibold">Menu</h2>
      <div className="space-y-2 text-sm">
        <p className="cursor-pointer hover:bg-gray-100 p-2 rounded">Home</p>
        <p className="cursor-pointer hover:bg-gray-100 p-2 rounded">Subscriptions</p>
        <p className="cursor-pointer hover:bg-gray-100 p-2 rounded">Library</p>
      </div>
    </aside>

    {/* Main */}
    <div className="flex-1 flex flex-col">

      {/* Navbar */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">StreamVault</h1>

        <div className="flex items-center gap-2 w-full max-w-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 border px-4 py-2 rounded-l-full outline-none"
          />
          <button className="px-4 py-2 border rounded-r-full bg-gray-100">
            <Search size={18} />
          </button>
        </div>

        <button className="px-4 py-2 border rounded-lg"
          onClick = {() => setIsUploadOpen(true)}
          >
          Upload
        </button>
      </header>

      {/* Content */}
      <main className="p-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <VideoGrid videos={filteredVideos} />
        )}
      </main>

      <UploadVideoModal
      isOpen={isUploadOpen}
      onClose={() => setIsUploadOpen(false)}
    />

    </div>
  </div>
);
}