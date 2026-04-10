import { useState } from 'react'
import './App.css'
import { VideoPlayer } from './VideoPlayer'
import { useRef } from 'react'
import { Controls, createPlayer} from '@videojs/react'
import { Video, videoFeatures } from '@videojs/react/video'


function App() {
  
  const Player = createPlayer({
    features : videoFeatures,
  })

  function Controls() {
    const store = Player.usePlayer();
    const paused = Player.usePlayer((s) => s.paused);

    return (
    <div className="react-create-player-basic__controls">
      <button
        type="button"
        className="react-create-player-basic__button"
        onClick={() => (paused ? store.play() : store.pause())}
      >
        {paused ? 'Play' : 'Pause'}
      </button>
    </div>
  );

  }
  return (
    <>
      <div>
        <h1> Video Player</h1>
      </div>  
      <VideoPlayer/>
    </>
  )
}

export default App
