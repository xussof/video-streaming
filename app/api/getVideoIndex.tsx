// En getVideoIndex.ts
export const getVideoIndex = async (videoIndex: string): Promise<string> => {
  const apiHost = process.env.NEXT_PUBLIC_SIV_RAPIDAPIHOST;
  const apiKey = process.env.NEXT_PUBLIC_SIV_RAPIDAPIKEY;
  const baseUrl = process.env.NEXT_PUBLIC_SIV_URL;
  const apiUrl = `${baseUrl}api/scaleway-watch-video/${videoIndex}`;
  const userKey = process.env.NEXT_PUBLIC_SERVICE_USER_MANAGEMENT_KEY;

  if (!apiHost || !apiKey || !apiUrl || !userKey || !baseUrl) {
    throw new Error(
      "API Host, Key, userKey, URL or base URL is missing. Please check your environment variables."
    );
  }
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": apiHost,
        "X-RapidAPI-Key": apiKey,
        "user-management-key": userKey,
      },
      body: JSON.stringify({
        bucket_name: "siv-pre",
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    console.log("Contenido del índice M3U8:", data.substring(0, 1000));
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching video index:", error.message);
    } else {
      console.error("Unknown error fetching video index:", error);
    }
    throw error;
  }
};
