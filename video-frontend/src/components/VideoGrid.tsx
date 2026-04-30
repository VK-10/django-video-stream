import VideoCard from "./VideoCard";
function VideoGrid({ videos }: any) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
      {videos.map((video: any) => (
        <VideoCard
          key={video.id}
          video={video}
        />
      ))}
    </div>
  );
}
export default VideoGrid;