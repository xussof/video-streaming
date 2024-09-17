// En getVideoSegment.ts
export const getVideoSegment = async (
  videoId: string,
  segmentIndex: number
): Promise<Blob> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_SIV_URL}api/scaleway-watch-hls-segment/${videoId}/${segmentIndex}`;
  const apiHost = process.env.NEXT_PUBLIC_SIV_RAPIDAPIHOST;
  const apiKey = process.env.NEXT_PUBLIC_SIV_RAPIDAPIKEY;
  const userKey = process.env.NEXT_PUBLIC_SERVICE_USER_MANAGEMENT_KEY;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": apiHost || "",
        "X-RapidAPI-Key": apiKey || "",
        "user-management-key": userKey || "",
      },
      body: JSON.stringify({
        bucket_name: "siv-pre",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    console.log("Segmento obtenido:", segmentIndex);
    return blob;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching video segment:", error.message);
    } else {
      console.error("Unknown error fetching video segment:", error);
    }
    throw error;
  }
};
