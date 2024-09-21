// En VideoPlayer.tsx
"use client";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { getVideoIndex } from "../api/getVideoIndex";
import { getVideoSegment } from "../api/getVideoSegment";

interface VideoState {
  playedSeconds: number;
  loadedSeconds: number;
}

export const VideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSegment, setCurrentSegment] = useState<number>(0);

  const handleError = (error: unknown) => {
    console.error("Error playing video:", error);
    setError("An error occurred while playing the video.");
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videoId = 1;
        const indexContent = await getVideoIndex(videoId);

        // Crea un blob con el contenido del índice M3U8
        const blob = new Blob([indexContent], {
          type: "application/vnd.apple.mpegurl",
        });
        const url = window.URL.createObjectURL(blob);
        setVideoUrl(url);

        // Obtiene el primer segmento
        await getVideoSegment(videoId, 0);
        setCurrentSegment(1); // Se prepara para cargar el siguiente segmento
      } catch (err) {
        console.error("Error loading video:", err);
        setError("An error occurred while loading the video.");
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, []);

  const handleProgress = async (state: VideoState) => {
    if (!videoUrl) return;

    const currentTime = state.playedSeconds;
    const duration = state.loadedSeconds;

    // Calcula cuándo cargar el siguiente segmento
    if (currentTime > duration * 0.75) {
      try {
        await getVideoSegment(1, currentSegment);
        setCurrentSegment(currentSegment + 1);
      } catch (err) {
        console.error("Error loading next segment:", err);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!videoUrl) {
    return <div>Video index not found.</div>;
  }

  return (
    <div id="player" className="m-8 h-full">
      <ReactPlayer
        url={videoUrl}
        controls={true}
        width="100%"
        height="100%"
        playing={false}
        config={{
          file: {
            hlsOptions: {
              autoStartLoad: true,
              startPosition: -1,
              maxBufferLength: 60,
              liveSyncDurationCount: 1,
              maxMaxBufferLength: 60,
              backBufferLength: 60,
              maxBufferHole: 0.2,
              maxStarvationDelay: 10,
              maxLoadingDelay: 5,
              fpsDroppedMonitoringPeriod: 5000,
              fpsDroppedMonitoringThreshold: 0.3,
            },
          },
        }}
        onError={(error) => {
          console.error("ReactPlayer error:", error);
          handleError(error);
        }}
        onProgress={(state) => handleProgress(state)}
      />
    </div>
  );
};
