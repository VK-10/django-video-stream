import { useNavigate } from "react-router-dom";
import { memo } from "react";

function VideoCard({ video }: any) {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/videos/${video.id}`);

  const initials = video.name
    ? video.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "SV";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="video-card"
    >
      {/* Thumbnail — locked 16:9 */}
      <div className="video-thumb">
        <img src={video.thumbnail} alt={video.title} />
        <div className="video-thumb-overlay">
          <div className="play-btn-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <span className="video-duration">{video.duration || "10:20"}</span>
      </div>

      {/* Info — fixed height */}
      <div className="video-info">
        {video.channelAvatar ? (
          <img src={video.channelAvatar} alt={video.name} className="video-avatar" style={{ objectFit: "cover" }} />
        ) : (
          <div className="video-avatar">{initials}</div>
        )}

        <div className="video-meta">
          <h3 className="video-title">{video.title}</h3>
          <p className="video-channel">{video.name}</p>
          <p className="video-stats">{video.views || "12K views"} · {video.time || "2 days ago"}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(VideoCard);