import axios from "axios";
export const getVideoIndex = async (videoId: string): Promise<string[]> => {
  const apiHost = process.env.NEXT_PUBLIC_SIV_RAPIDAPIHOST;
  const apiKey = process.env.NEXT_PUBLIC_SIV_RAPIDAPIKEY;
  const baseUrl = process.env.NEXT_PUBLIC_SIV_URL;
  const apiUrl = `${baseUrl}api/scaleway-watch-video/${videoId}`;
  console.log("apiurl: ", apiUrl);
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
          // "Content-Type": "application/json",
          // "X-RapidAPI-Host": apiHost,
          // "X-RapidAPI-Key": apiKey,
          // "user-management-key": userKey,
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "cloudsolute-pre.p.rapidapi.com",
          "X-RapidAPI-Key":
            "c47807e6e4msh1064e0320d58bb2p1e17d2jsn00995ba034f8",
          "user-management-key": "gHrggF34u7GS1FY1h4kUfOIkXOyapZqw",
        },
      }
    );

    const data = response.data;
    console.log("Contenido del índice M3U8:", data.substring(0, 1000));

    // Extrae los nombres de archivo de los segmentos
    const segmentNames = data
      .split("\n")
      .filter((line: string) => line.endsWith(".ts"))
      .map((line: string) => line.trim());

    console.log("Nombres de archivos de segmentos", segmentNames);
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
