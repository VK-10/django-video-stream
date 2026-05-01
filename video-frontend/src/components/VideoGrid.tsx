import VideoCard from "./VideoCard";

function VideoGrid({ videos }: any) {
  return (
    <div className="grid gap-6 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      lg:grid-cols-4">
      
      {videos.map((video: any) => (
        <VideoCard key={video.id} video={video} />
      ))}

    </div>
  );
}
export default VideoGrid;