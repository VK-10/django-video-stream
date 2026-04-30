function VideoCard({ video }: any) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl shadow-sm">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
        />

        <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
          {video.duration}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-lg line-clamp-2">
          {video.title}
        </h3>

        <p className="text-sm text-gray-500">
          {video.views}
        </p>
      </div>
    </div>
  );
}

export default VideoCard