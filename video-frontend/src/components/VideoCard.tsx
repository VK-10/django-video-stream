import { useNavigate } from "react-router-dom";

function VideoCard({ video }: any) {
  const navigate = useNavigate();
  console.log("VIDEO-cardddddddd:", video);
  const handleClick = () => {
    navigate(`/videos/${video.id}`)
  };
  return (
    <div className="cursor-pointer group" onClick={handleClick}>

      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={`${video.thumbnail}`}
          className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
        {/* <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
          10:20
        </span> */}
      </div>

      {/* Info */}
      <div className="flex gap-3 mt-3">

        {/* Avatar */}
        <div className="w-9 h-9 bg-gray-300 rounded-full" />

        {/* Text */}
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-400 transition">
            {video.title}
          </h3>

          <p className="text-xs text-gray-500">
            {video.name}
          </p>

          {/* <p className="text-xs text-gray-500">
            12K views • 2 days ago
          </p> */}
        </div>
      </div>

    </div>
  );
}


export default VideoCard;