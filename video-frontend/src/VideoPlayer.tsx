import { createPlayer } from '@videojs/react';
import { VideoSkin, Video, videoFeatures } from '@videojs/react/video';
import '@videojs/react/video/skin.css';

const Player = createPlayer({ features: videoFeatures });

export function VideoPlayer() {
  return (
    <Player.Provider>
      <VideoSkin poster="">
        <Video src="http://localhost:8000/uploads/vids/720624ad-be38-4b5b-b733-febe47fbf96c/index.m3u8" playsInline />
      </VideoSkin>
    </Player.Provider>
  );
}