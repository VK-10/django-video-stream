import { useState } from "react";
import { Search } from "lucide-react";

const mockVideos = [
  {
    id: 1,
    title: "Distributed Systems Lecture",
    thumbnail:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
    duration: "24:18",
    views: "18K views"
  },
  {
    id: 2,
    title: "Go Backend Streaming Build",
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    duration: "17:42",
    views: "9K views"
  },
  {
    id: 3,
    title: "HLS Architecture Explained",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    duration: "31:05",
    views: "22K views"
  },
  {
    id: 4,
    title: "System Design Mock Interview",
    thumbnail:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    duration: "52:10",
    views: "12K views"
  },
  {
    id: 5,
    title: "React Performance Patterns",
    thumbnail:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    duration: "14:03",
    views: "6K views"
  },
  {
    id: 6,
    title: "Building a Video Platform",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    duration: "43:21",
    views: "30K views"
  }
];


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


export default function Dashboard() {
  const [query, setQuery] = useState("");

  const filteredVideos = mockVideos.filter((video) =>
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

        {/* Hero */}
        <section className="rounded-3xl overflow-hidden relative shadow-sm mb-12">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475"
            className="w-full h-[420px] object-cover"
            alt="featured"
          />

          <div className="absolute inset-0 bg-black/45 flex items-end">
            <div className="p-10 text-white max-w-2xl space-y-4">
              <p className="text-sm uppercase tracking-widest opacity-80">
                Featured
              </p>

              <h2 className="text-5xl font-bold leading-tight">
                Build and Stream Video At Scale
              </h2>

              <p className="text-lg opacity-90">
                Browse uploaded lectures, tutorials and engineering walkthroughs.
              </p>

              <button className="bg-white text-black px-6 py-3 rounded-2xl font-semibold">
                Watch Now
              </button>
            </div>
          </div>
        </section>


        {/* Categories */}
        <section className="flex gap-4 flex-wrap mb-6">
          {[
            "All",
            "Systems",
            "Backend",
            "Streaming",
            "React",
            "Algorithms"
          ].map((item) => (
            <button
              key={item}
              className="px-5 py-2 rounded-full border hover:shadow-sm"
            >
              {item}
            </button>
          ))}
        </section>


        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">
              Recommended Videos
            </h2>

            <button className="text-sm font-medium border px-4 py-2 rounded-xl">
              View All
            </button>
          </div>

          <VideoGrid videos={filteredVideos} />
        </section>

      </main>
    </div>
  );
}