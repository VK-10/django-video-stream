import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getVideos } from "../services/videoService";
import VideoGrid from "../components/VideoGrid";



export default function Dashboard() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data)
      } catch {
        console.error("failed");
      } finally {
        setLoading(false)
      }
    };

    fetchVideos();
  }, [])

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(
      query.toLowerCase()
    )
  );

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header className="border-b sticky top-0 bg-white z-20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            StreamVault
          </h1>

          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border outline-none"
            />
          </div>

          <button className="px-5 py-3 rounded-2xl border font-medium hover:shadow-sm">
            Upload
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-3xl font-bold mb-6">
          Recommended Videos
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading videos...</p>
        ) : (
          <VideoGrid videos={filteredVideos} />
        )}

      </main>
    </div>
  );
}