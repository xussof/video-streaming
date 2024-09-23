"use client";
import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import { getVideoIndex } from "../api/getVideoIndex";
import { getVideoSegment } from "../api/getVideoSegment";
import parse from "m3u8-parser";

interface VideoState {
  playedSeconds: number;
  loadedSeconds: number;
}

export const VideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSegment, setCurrentSegment] = useState<number>(0);
  const [totalSegments, setTotalSegments] = useState<number>(0);
  const playerRef = useRef<ReactPlayer>(null);

  const handleError = (message: string) => {
    console.error(message);
    setError(message);
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videoIndex = "vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps";

        // Obtiene y procesa el índice M3U8
        const indexContent = await getVideoIndex(videoIndex);
        console.log("indexcontent", indexContent);
        const parser = parse(indexContent);
        console.log("parser", parser);
        const segments = parser.segments;
        console.log("segments", segments);

        if (!segments || !segments.length) {
          throw new Error("No video segments found");
        }

        setTotalSegments(segments.length);

        // Carga los primeros 3 segmentos
        const initialSegments = segments.slice(0, 3);
        const urls = await Promise.all(
          initialSegments.map(async (segment: object, index: number) => {
            const blob = await getVideoSegment(videoIndex, index);
            console.log("initialsegment", initialSegments);
            console.log("urls", urls);
            console.log("blob", blob);
            console.log(
              "window.URL.createObjectURL(blob)",
              window.URL.createObjectURL(blob)
            );
            return window.URL.createObjectURL(blob);
          })
        );

        // Crea un nuevo índice M3U8 con las URLs locales
        const newM3U8Content = initialSegments.reduce((acc, segment, index) => {
          acc += `#EXTINF:${segment.duration},${segment.title || ""}\n`;
          acc += `${urls[index]}\n`;
          console.log("acc", acc);
          return acc;
        }, "#EXTM3U\n");

        // Actualiza la URL del reproductor
        const blob = new Blob([newM3U8Content], {
          type: "application/vnd.apple.mpegurl",
        });
        console.log("newBblob", blob);
        const url = window.URL.createObjectURL(blob);
        console.log("newURL", url);
        setVideoUrl(url);
      } catch (err) {
        console.error("Error loading video:", err);
        handleError("An error occurred while loading the video.");
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, []);

  const handleProgress = async (state: VideoState) => {
    if (!videoUrl || !playerRef.current) return;

    const currentTime = state.playedSeconds;
    const duration = state.loadedSeconds;

    // Calcula cuándo cargar el siguiente segmento
    if (currentTime > duration * 0.75 && currentSegment < totalSegments - 1) {
      try {
        const videoIndex = "vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps";
        const nextSegment = await getVideoSegment(
          videoIndex,
          currentSegment + 1
        );
        const blobUrl = window.URL.createObjectURL(nextSegment);

        // Actualiza la URL del reproductor con el nuevo segmento
        const parser = parse(videoUrl);
        parser.segments[currentSegment + 1].uri = blobUrl;
        console.log(
          "parser.segments[currentSegment + 1].uri",
          parser.segments[currentSegment + 1].uri
        );
        const newM3U8Content = parser.toString();
        console.log(newM3U8Content);
        const newBlob = new Blob([newM3U8Content], {
          type: "application/vnd.apple.mpegurl",
        });
        setVideoUrl(window.URL.createObjectURL(newBlob));

        setCurrentSegment(currentSegment + 1);
      } catch (err) {
        console.error("Error loading next segment:", err);
        handleError("An error occurred while loading the next video segment.");
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
        ref={playerRef}
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
          handleError("An error occurred while playing the video.");
        }}
        onProgress={(state) => handleProgress(state)}
      />
    </div>
  );
};
