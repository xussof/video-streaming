"use client";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { getVideoIndex } from "../api/getVideoIndex";

export const VideoPlayer = () => {
  const [videoIndex, setVideoIndex] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    console.error("Error playing video:", error);
    setError("An error occurred while playing the video.");
  };

  useEffect(() => {
    const isMounted = true;
    const loadVideo = async () => {
      try {
        const index = await getVideoIndex();
        if (isMounted) {
          setVideoIndex(index);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching video index:", err);
          setError("An error occurred while fetching the video index.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadVideo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!videoIndex) {
    return <div>Video index not found.</div>;
  }

  return (
    <div id="player" className="m-8 h-full">
      <ReactPlayer
        url={videoIndex}
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
