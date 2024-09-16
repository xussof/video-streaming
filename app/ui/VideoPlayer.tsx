"use client";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { getVideoIndex } from "../api/getVideoIndex";

export const VideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    console.error("Error playing video:", error);
    setError("An error occurred while playing the video.");
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const indexContent = await getVideoIndex();
        if (typeof indexContent === "string") {
          // Parsea el contenido del índice M3U8
          const segments = indexContent
            .split("\n")
            .filter((line) => line.startsWith("#EXT-X-"));

          // Crea un array con todas las URLs de los segmentos
          const urls = segments.map((segment) => {
            const [, , , path] = segment.split(" ");
            return `${process.env.NEXT_PUBLIC_SIV_URL}${path}`;
          });

          // Crea un blob con todos los segmentos
          const blob = new Blob(urls, {
            type: "application/vnd.apple.mpegurl",
          });
          const url = window.URL.createObjectURL(blob);
          setVideoUrl(url);
        }
      } catch (err) {
        console.error("Error fetching video index:", err);
        setError("An error occurred while fetching the video index.");
      } finally {
        setLoading(false);
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

  if (!videoUrl) {
    return <div>Video index not found.</div>;
  }

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
              maxBufferLength: 30, // Aumenta el buffer para dar más tiempo al demuxer
              liveSyncDurationCount: 1,
              maxMaxBufferLength: 30,
              backBufferLength: 30,
              maxBufferHole: 0.2,
              maxStarvationDelay: 10,
              maxLoadingDelay: 5,
              fpsDroppedMonitoringPeriod: 5000, // Monitorea cada 5 segundos
              fpsDroppedMonitoringThreshold: 0.3, // Considera que los FPS han caído si bajan un 30%
            },
          },
        }}
        onError={handleError}
      />
    </div>
  );
};
