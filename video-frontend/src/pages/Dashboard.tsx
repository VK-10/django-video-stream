import { useEffect, useState } from "react";
import { Search, Home, BookMarked, Library, Upload, LogOut, Play } from "lucide-react";
import { getVideos } from "../services/videoService";
import VideoGrid from "../components/VideoGrid";
import type { Video } from "../models/vid-model";
import UploadVideoModal from "../components/Modals/UploadVideoModal";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        console.log("RETURNED FROM SERVICE:", data);
        setVideos(Array.isArray(data) ? data : []);
        console.log("After setVideos:", data);
      } catch (error) {
        console.error("failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  console.log("VIDEOS STATE:", videos);

  const filteredVideos = Array.isArray(videos)
    ? videos.filter((v) => v.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="dash-layout">

      {/* ── Sidebar ── */}
      <aside className="dash-sidebar">
        <div className="sidebar-logo">StreamVault</div>

        <nav className="sidebar-nav">
          <p className="sidebar-nav-label">Menu</p>
          <div className="sidebar-item active">
            <Home size={15} /> Home
          </div>
          <div className="sidebar-item">
            <BookMarked size={15} /> Subscriptions
          </div>
          <div className="sidebar-item">
            <Library size={15} /> Library
          </div>
        </nav>

        <nav className="sidebar-nav" style={{ marginTop: "auto" }}>
          <p className="sidebar-nav-label">Account</p>
          <div className="sidebar-item" onClick={() => navigate("/logout")}>
            <LogOut size={15} /> Sign Out
          </div>
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="dash-main">

        {/* Header */}
        <header className="dash-header">
          <div className="search-wrap">
            <Search size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos…"
            />
          </div>

          <button className="btn-upload" onClick={() => setIsUploadOpen(true)}>
            <Upload size={13} style={{ display: "inline", marginRight: 6 }} />
            Upload
          </button>
        </header>

        {/* Content */}
        <main className="dash-content">
          <h2 className="dash-section-title">
            {query ? `Results for "${query}"` : "All Videos"}
          </h2>

          {loading ? (
            <div className="dash-loading">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="dash-empty">
              <Play size={32} strokeWidth={1} />
              <p>No videos found</p>
              <span>Try a different search or upload your first video</span>
            </div>
          ) : (
            <VideoGrid videos={filteredVideos} />
          )}
        </main>
      </div>

      {/* Upload Modal */}
      <UploadVideoModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}