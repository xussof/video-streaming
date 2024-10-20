"use client";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { getVideoSegment } from "../api/getVideoSegment";
import { getVideoIndex } from "../api/getVideoIndex";

interface VideoIndex {
  segments?: string[];
}

interface SegmentInfo {
  url: string;
  duration: number;
}

const videoId = "vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps";
const SEGMENTS_TO_PRELOAD = 3;
const BUFFER_THRESHOLD = 0.75;

export const VideoPlayer = () => {
  const [segments, setSegments] = useState<SegmentInfo[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeVideo = async () => {
      try {
        // Obtener el índice del video
        const videoIndexResponse = await getVideoIndex(videoId);

        // Verificar si hay segmentos disponibles
        if (!Array.isArray(videoIndexResponse)) {
          throw new Error("Invalid response from getVideoIndex");
        }

        const videoIndex: VideoIndex = {
          segments: videoIndexResponse,
        };

        // Precargar los primeros segmentos
        const initialSegments: SegmentInfo[] = [];
        for (
          let i = 0;
          i < Math.min(SEGMENTS_TO_PRELOAD, videoIndex.segments?.length || 0);
          i++
        ) {
          const blob = await getVideoSegment(videoId, i);
          const url = window.URL.createObjectURL(blob);
          initialSegments.push({ url, duration: 17 }); // Duración fija de 17 segundos por ahora
        }

        setSegments(initialSegments);
        setLoading(false);
      } catch (err) {
        console.error("Error initializing video:", err);
        setError("An error occurred while loading the video.");
      }
    };

    initializeVideo();
  }, []);

  const createM3U8File = (): string => {
    const m3u8Header = `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:${Math.ceil(
      17
    )}\n#EXT-X-MEDIA-SEQUENCE:0\n`;

    const segmentList = segments
      .map((segment) => `#EXTINF:${segment.duration},\n${segment.url}`)
      .join("\n");

    const m3u8Footer = "#EXT-X-ENDLIST";
    const m3u8Content = `${m3u8Header}${segmentList}\n${m3u8Footer}`;

    const blob = new Blob([m3u8Content], {
      type: "application/vnd.apple.mpegurl",
    });
    return window.URL.createObjectURL(blob);
  };

  const handleProgress = async (state: {
    playedSeconds: number;
    loadedSeconds: number;
  }) => {
    const { playedSeconds, loadedSeconds } = state;
    if (!segments.length || playedSeconds === 0) return;

    const currentTime = playedSeconds;
    const duration = loadedSeconds;

    if (
      currentTime > duration * BUFFER_THRESHOLD &&
      currentSegmentIndex < segments.length - 1
    ) {
      try {
        await loadNextSegments();
      } catch (err) {
        console.error("Error loading next segments:", err);
      }
    }
  };

  const loadNextSegments = async () => {
    try {
      const nextSegments: SegmentInfo[] = [];
      for (let i = 1; i <= SEGMENTS_TO_PRELOAD; i++) {
        const index = currentSegmentIndex + i;
        if (index >= segments.length) break;

        const blob = await getVideoSegment(videoId, index);
        const url = window.URL.createObjectURL(blob);
        nextSegments.push({ url, duration: segments[index].duration });
      }

      setSegments((prevSegments) => [...prevSegments, ...nextSegments]);
      setCurrentSegmentIndex(currentSegmentIndex + 1);
    } catch (err) {
      console.error("Error loading next segments:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!segments.length) {
    return <div>No video segments found.</div>;
  }

  return (
    <div id="player" className="m-8 h-full">
      <ReactPlayer
        url={createM3U8File()}
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
              maxBufferLength: 15,
              liveSyncDurationCount: 1,
              maxMaxBufferLength: 15,
              backBufferLength: 15,
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
        }}
        onProgress={handleProgress}
      />
    </div>
  );
};
