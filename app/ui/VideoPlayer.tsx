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
    if (error instanceof Error) {
      setError(error.message);
    } else if (error instanceof Event) {
      console.log("Error event details:", {
        type: error.type,
        target: error.target,
        currentTarget: error.currentTarget,
        eventPhase: error.eventPhase,
        bubbles: error.bubbles,
        cancelable: error.cancelable,
        composed: error.composed,
        defaultPrevented: error.defaultPrevented,
        returnValue: error.returnValue,
        timeStamp: error.timeStamp,
      });
      setError(
        "An error occurred while playing the video. Check console for details."
      );
    } else {
      setError("An unknown error occurred while playing the video.");
    }
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const indexContent = await getVideoIndex();
        if (typeof indexContent === "string") {
          console.log(
            "Contenido del índice M3U8 en VideoPlayer:",
            indexContent.substring(0, 1000)
          );
          // Crea un blob con el contenido del índice M3U8
          const blob = new Blob([indexContent], {
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
              maxBufferLength: 60, // Aumenta el buffer para dar más tiempo al demuxer
              liveSyncDurationCount: 1,
              maxMaxBufferLength: 60,
              backBufferLength: 60,
              maxBufferHole: 0.2,
              maxStarvationDelay: 10,
              maxLoadingDelay: 5,
              fpsDroppedMonitoringPeriod: 5000, // Monitorea cada 5 segundos
              fpsDroppedMonitoringThreshold: 0.3, // Considera que los FPS han caído si bajan un 30%
            },
          },
        }}
        onError={(error) => {
          console.error("ReactPlayer error:", error);
          handleError(error);
        }}
        onPlay={() => console.log("Video started playing")}
        onPause={() => console.log("Video paused")}
        onEnded={() => console.log("Video ended")}
      />
    </div>
  );
};
