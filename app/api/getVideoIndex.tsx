export const getVideoIndex = async () => {
  const apiHost = process.env.NEXT_PUBLIC_SIV_RAPIDAPIHOST;
  const apiKey = process.env.NEXT_PUBLIC_SIV_RAPIDAPIKEY;
  const apiUrl = `${process.env.NEXT_PUBLIC_SIV_URL}api/scaleway-watch-video/`;

  if (!apiHost || !apiKey || !apiUrl) {
    throw new Error(
      "API Host, Key or URL is missing. Please check your environment variables."
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
    console.log(data);
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
