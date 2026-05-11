import { memo } from "react";
import VideoCard from "./VideoCard";

const VideoGrid = memo(function VideoGrid({ videos }: any) {
  return (
    <div className="video-grid">
      {videos.map((video: any) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
});

export default VideoGrid;