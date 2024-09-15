"use client";
import { useState } from "react";
import ReactPlayer from "react-player";

export const VideoPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const videoUrl = "/video/vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps.m3u8";
  const videoImage = "/thumbnails.jpg";

  const handleError = (error: unknown) => {
    console.error("Error playing video:", error);
  };

  const handlePlaying = () => {
    setPlaying(!playing);
  };

  return (
    <div id="player" className="m-8 h-full">
      <ReactPlayer
        url={videoUrl}
        controls={true}
        width={640}
        height={360}
        playing={playing}
        light={videoImage}
        config={{
          file: {
            hlsOptions: {
              autoStartLoad: true,
              startPosition: -1,
              maxBufferLength: 30,
              liveSyncDurationCount: 3,
              maxMaxBufferLength: 10,
              backBufferLength: 10,
              maxBufferHole: 0.1,
              maxStarvationDelay: 4,
              maxLoadingDelay: 0.5,
            },
          },
        }}
        onError={handleError}
      />
      <button onClick={handlePlaying}>{playing ? "Pause" : "Play"}</button>
    </div>
  );
};
