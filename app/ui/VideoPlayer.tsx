"use client";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { getVideoIndex } from "../api/getVideoIndex";
import { getVideoSegment } from "../api/getVideoSegment";

interface VideoState {
  playedSeconds: number;
  loadedSeconds: number;
}

async function loadNextSegment(
  videoId: string,
  currentSegmentIndex: number,
  setVideoUrl: React.Dispatch<React.SetStateAction<string | null>>,
  setCurrentSegmentIndex: React.Dispatch<React.SetStateAction<number>>
): Promise<void> {
  try {
    const blob = await getVideoSegment(videoId, currentSegmentIndex + 1);

    // Crea un blob con el contenido del segmento
    const url = window.URL.createObjectURL(blob);

    // Actualiza el estado para cargar el siguiente segmento
    setVideoUrl(url);
    setCurrentSegmentIndex(currentSegmentIndex + 1);
  } catch (err) {
    console.error("Error loading next segment:", err);
    throw err;
  }
}

export const VideoPlayer = () => {
  const [segmentUrls, setSegmentUrls] = useState<string[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    console.error("Error playing video:", error);
    setError("An error occurred while playing the video.");
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videoId = "vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps";

        // Obtiene las URLs de los segmentos
        const urls = await getVideoIndex(videoId);
        setSegmentUrls(urls);

        // Carga el primer segmento
        await loadNextSegment(videoId, 0, setVideoUrl, setCurrentSegmentIndex);

        setLoading(false);
      } catch (err) {
        console.error("Error loading video:", err);
        setError("An error occurred while loading the video.");
      }
    };
    loadVideo();
  }, []);

  const handleProgress = async (state: VideoState) => {
    if (!segmentUrls.length || !videoUrl) return;

    const currentTime = state.playedSeconds;
    const duration = state.loadedSeconds;

    // Calcular cuándo cargar el siguiente segmento
    if (
      currentTime > duration * 0.75 &&
      currentSegmentIndex < segmentUrls.length - 1
    ) {
      try {
        await loadNextSegment(
          "vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps",
          currentSegmentIndex,
          setVideoUrl,
          setCurrentSegmentIndex
        );
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

  if (!segmentUrls.length || !videoUrl) {
    return <div>No video segments found.</div>;
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
