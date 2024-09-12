"use client";
import ReactPlayer from "react-player";

export const VideoPlayer = () => {
  const videoUrl = "/video/vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps.m3u8";

  const handleError = (error: unknown) => {
    console.error("Error playing video:", error);
  };
  return (
    <div id="player" className="m-8 h-full">
      <ReactPlayer
        url={videoUrl}
        controls={true}
        width={640}
        height={360}
        playsinline={true}
        config={{
          file: {
            hlsOptions: {
              autoStartLoad: true,
              startPosition: -1,
              maxBufferLength: 30,
              liveSyncDurationCount: 3,
              maxMaxBufferLength: 600,
            },
          },
        }}
        onError={handleError}
      />
    </div>
  );
};
