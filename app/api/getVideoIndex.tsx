import axios from "axios";

export const getVideoIndex = async (videoId: string): Promise<string[]> => {
  const apiHost = process.env.NEXT_PUBLIC_SIV_RAPIDAPIHOST;
  const apiKey = process.env.NEXT_PUBLIC_SIV_RAPIDAPIKEY;
  const baseUrl = process.env.NEXT_PUBLIC_SIV_URL;
  const apiUrl = `${baseUrl}api/scaleway-watch-video/${videoId}`;
  const userKey = process.env.NEXT_PUBLIC_SERVICE_USER_MANAGEMENT_KEY;

  if (!apiHost || !apiKey || !apiUrl || !userKey || !baseUrl) {
    throw new Error(
      "API Host, Key, userKey, URL or base URL is missing. Please check your environment variables."
    );
  }

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
      }
    );

    const data = response.data;
    console.log("data", data);
    // Extrae los nombres de archivo de los segmentos
    const segmentNames = data
      .split("\n")
      .filter((line: string) => line.endsWith(".ts"))
      .map((line: string) => line.trim());
    console.log("segmentNames", segmentNames);
    return segmentNames;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching video index:", error.message);
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    } else {
      console.error("Unknown error fetching video index:", error);
      throw error;
    }
  }
};
