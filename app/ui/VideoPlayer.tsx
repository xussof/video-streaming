"use client";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { getVideoSegment } from "../api/getVideoSegment";

// Crear un archivo .m3u8 dinámico a partir de las URLs de los segmentos
const createM3U8File = (segmentUrls: string[]): string => {
  const m3u8Header = `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:10\n#EXT-X-MEDIA-SEQUENCE:0\n`;
  const segmentList = segmentUrls
    .map((url) => `#EXTINF:10,\n${url}`)
    .join("\n");
  const m3u8Footer = "#EXT-X-ENDLIST";
  const m3u8Content = `${m3u8Header}${segmentList}\n${m3u8Footer}`;
  const blob = new Blob([m3u8Content], {
    type: "application/vnd.apple.mpegurl",
  });
  return window.URL.createObjectURL(blob);
};

// Cargar los siguientes segmentos de video
const loadNextSegments = async (
  videoId: string,
  currentSegmentIndex: number,
  setSegmentUrls: React.Dispatch<React.SetStateAction<string[]>>,
  setCurrentSegmentIndex: React.Dispatch<React.SetStateAction<number>>
): Promise<void> => {
  try {
    const nextSegments: string[] = [];
    for (let i = 1; i <= 1; i++) {
      const blob = await getVideoSegment(videoId, currentSegmentIndex + i);
      const url = window.URL.createObjectURL(blob);
      nextSegments.push(url);
    }
    setSegmentUrls((prevUrls) => [...prevUrls, ...nextSegments]);
    setCurrentSegmentIndex(currentSegmentIndex + 3);
  } catch (err) {
    console.error("Error loading next segments:", err);
    throw err;
  }
};

// Manejar el progreso del video
const handleProgress = async (
  state: { playedSeconds: number; loadedSeconds: number },
  segmentUrls: string[],
  currentSegmentIndex: number,
  loadNextSegments: (
    videoId: string,
    currentSegmentIndex: number,
    setSegmentUrls: React.Dispatch<React.SetStateAction<string[]>>,
    setCurrentSegmentIndex: React.Dispatch<React.SetStateAction<number>>
  ) => Promise<void>,
  setSegmentUrls: React.Dispatch<React.SetStateAction<string[]>>,
  setCurrentSegmentIndex: React.Dispatch<React.SetStateAction<number>>
): Promise<void> => {
  const { playedSeconds, loadedSeconds } = state;
  if (!segmentUrls.length || playedSeconds === 0) return;

  const currentTime = playedSeconds;
  const duration = loadedSeconds;

  // Calcular cuándo cargar los siguientes segmentos, a 3/4 del video
  if (
    currentTime > duration * 0.75 &&
    currentSegmentIndex < segmentUrls.length - 1
  ) {
    try {
      await loadNextSegments(
        "vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps",
        currentSegmentIndex,
        setSegmentUrls,
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
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videoId = "vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps";

        // Pre-cargar los primeros 3 segmentos y generar el archivo .m3u8
        const segmentBlobs: string[] = [];
        for (let i = 0; i < 3; i++) {
          const blob = await getVideoSegment(videoId, i);
          const url = window.URL.createObjectURL(blob);
          segmentBlobs.push(url);
        }

        // Crear el archivo .m3u8 dinámico
        const m3u8Url = createM3U8File(segmentBlobs);
        setVideoUrl(m3u8Url);

        setSegmentUrls(segmentBlobs);
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

  if (!segmentUrls.length || !videoUrl) {
    return <div>No video segments found.</div>;
  }

  return (
    <div id="player" className="m-8 h-full">
      <ReactPlayer
        url={videoUrl} // Pasar la URL del archivo .m3u8
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
        }}
        onProgress={(state) =>
          handleProgress(
            state,
            segmentUrls,
            currentSegmentIndex,
            loadNextSegments,
            setSegmentUrls,
            setCurrentSegmentIndex
          )
        }
      />
    </div>
  );
};
