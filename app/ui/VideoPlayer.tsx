"use client";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { getVideoIndex } from "../api/getVideoIndex";
import { getVideoSegment } from "../api/getVideoSegment";

interface VideoState {
  playedSeconds: number;
  loadedSeconds: number;
}

type LoadNextSegmentsFn = (
  videoId: string,
  currentSegmentIndex: number,
  setVideoUrls: React.Dispatch<React.SetStateAction<string[]>>,
  setCurrentSegmentIndex: React.Dispatch<React.SetStateAction<number>>
) => Promise<void>;

const loadNextSegments: LoadNextSegmentsFn = async (
  videoId: string,
  currentSegmentIndex: number,
  setVideoUrls: React.Dispatch<React.SetStateAction<string[]>>,
  setCurrentSegmentIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const nextSegments: string[] = [];
    for (let i = 1; i <= 3; i++) {
      // Pre-cargar los próximos 3 segmentos
      const blob = await getVideoSegment(videoId, currentSegmentIndex + i);
      const url = window.URL.createObjectURL(blob);
      nextSegments.push(url);

      console.log(`Loaded segment ${currentSegmentIndex + i}: ${url}`);
    }
    setVideoUrls((prevUrls) => [...prevUrls, ...nextSegments]);
    setCurrentSegmentIndex(currentSegmentIndex + 3);
  } catch (err) {
    console.error("Error loading next segments:", err);
    throw err;
  }
};

// Manejar el progreso del video
const handleProgress = async (
  state: VideoState,
  segmentUrls: string[],
  currentSegmentIndex: number,
  loadNextSegments: LoadNextSegmentsFn,
  setVideoUrls: React.Dispatch<React.SetStateAction<string[]>>,
  setCurrentSegmentIndex: React.Dispatch<React.SetStateAction<number>>
): Promise<void> => {
  if (!segmentUrls.length || state.playedSeconds === 0) return;

  const currentTime = state.playedSeconds;
  const duration = state.loadedSeconds;

  console.log(`Current time: ${currentTime}, Duration: ${duration}`);

  // Calcular cuándo cargar los siguientes segmentos, a 3/4
  if (
    currentTime > duration * 0.75 &&
    currentSegmentIndex < segmentUrls.length - 1
  ) {
    try {
      await loadNextSegments(
        "vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps",
        currentSegmentIndex,
        setVideoUrls,
        setCurrentSegmentIndex
      );
    } catch (err) {
      console.error("Error loading next segments:", err);
    }
  }
};

export const VideoPlayer = () => {
  const [segmentUrls, setSegmentUrls] = useState<string[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  const handleError = (error: unknown) => {
    console.error("Error playing video:", error);
    setError("An error occurred while playing the video.");
  };

  useEffect(() => {
    const loadVideo = async () => {
      console.log("Segment URLs:", segmentUrls);
      console.log("Video URLs:", videoUrls);
      try {
        const videoId = "vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps";

        // Obtiene los nombres de archivos de los segmentos
        const urls = await getVideoIndex(videoId);
        setSegmentUrls(urls);

        // Carga los primeros segmentos
        await loadNextSegments(
          videoId,
          -1,
          setVideoUrls,
          setCurrentSegmentIndex
        );

        setLoading(false);
      } catch (err) {
        console.error("Error loading video:", err);
        setError("An error occurred while loading the video.");
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

  if (!segmentUrls.length || !videoUrls.length) {
    return <div>No video segments found.</div>;
  }
  console.log("videoUrls dentro de reproductor", videoUrls);
  return (
    <div id="player" className="m-8 h-full">
      <ReactPlayer
        url={videoUrls}
        controls={true}
        width="100%"
        height="100%"
        playing={false}
        config={{
          file: {
            forceHLS: true,
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
        onProgress={(state) =>
          handleProgress(
            state,
            segmentUrls,
            currentSegmentIndex,
            loadNextSegments,
            setVideoUrls,
            setCurrentSegmentIndex
          )
        }
      />
    </div>
  );
};
