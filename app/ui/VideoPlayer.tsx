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
        playing={false}
        config={{
          file: {
            hlsOptions: {
              autoStartLoad: true,
              startPosition: -1,
              maxBufferLength: 15,
              liveSyncDurationCount: 1,
              maxMaxBufferLength: 10,
              backBufferLength: 10,
              maxBufferHole: 0.1,
              maxStarvationDelay: 4,
              maxLoadingDelay: 0.5,
              fpsDroppedMonitoringPeriod: 2000, // Monitorea cada 2 segundos
              fpsDroppedMonitoringThreshold: 0.2, // Considera que los FPS han caído si bajan un 20%
            },
          },
        }}
        onError={handleError}
      />
    </div>
  );
};
