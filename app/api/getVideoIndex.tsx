export const getVideoIndex = async () => {
  const apiHost = process.env.NEXT_PUBLIC_SIV_RAPIDAPIHOST;
  const apiKey = process.env.NEXT_PUBLIC_SIV_RAPIDAPIKEY;
  const apiUrl = `${process.env.NEXT_PUBLIC_SIV_URL}api/scaleway-watch-video/`;
  const userKey = process.env.NEXT_PUBLIC_SERVICE_USER_MANAGEMENT_KEY;

  if (!apiHost || !apiKey || !apiUrl || !userKey) {
    throw new Error(
      "API Host, Key, userKey or URL is missing. Please check your environment variables."
    );
  }
  try {
    const response = await fetch(
      `${apiUrl}vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps`,
      {
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
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    const baseUrl = process.env.NEXT_PUBLIC_SIV_URL;
    const modifiedIndex = data.replace(/(vid-.+\.ts)/g, `${baseUrl}$1`);
    console.log("Indice m3u8 de getVideoIndex", data);
    console.log("Indice modificado", modifiedIndex);
    return modifiedIndex;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching video index:", error.message);
    } else {
      console.error("Unknown error fetching video index:", error);
    }
    throw error;
  }
};
