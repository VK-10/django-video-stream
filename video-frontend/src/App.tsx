import VideoPlayer from "../src/features/video/Player";

function App() {
  return (
    <div>
      <h1>Video Player</h1>

      <VideoPlayer
        src="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
      />
    </div>
  );
}

export default App;