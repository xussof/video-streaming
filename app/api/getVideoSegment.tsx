import axios from "axios";

export const getVideoSegment = async (
  videoId: string,
  segmentIndex: number
): Promise<Blob> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_SIV_URL}api/scaleway-watch-hls-segment/${videoId}/${segmentIndex}`;
  const apiHost = process.env.NEXT_PUBLIC_SIV_RAPIDAPIHOST;
  const apiKey = process.env.NEXT_PUBLIC_SIV_RAPIDAPIKEY;
  const userKey = process.env.NEXT_PUBLIC_SERVICE_USER_MANAGEMENT_KEY;

  try {
    const response = await axios.post(
      apiUrl,
      { bucket_name: "siv-pre" },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": apiHost,
          "X-RapidAPI-Key": apiKey,
          "user-management-key": userKey,
        },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // Verificar si el tipo es válido
    if (blob.type && !blob.type.includes("video/")) {
      throw new Error("El tipo del blob no es válido");
    }

    return blob;
  } catch (error) {
    console.error("Error fetching video segment:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`HTTP error! status: ${error.response.status}`);
    }
    throw error;
  }
};
