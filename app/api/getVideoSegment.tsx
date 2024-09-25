export const getVideoSegment = async (
  videoId: string,
  segmentIndex: number
): Promise<Blob> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_SIV_URL}api/scaleway-watch-hls-segment/${videoId}/${segmentIndex}`;

  console.log("URL de segmento:", apiUrl);
  console.log("Clave de API:", process.env.NEXT_PUBLIC_SIV_RAPIDAPIKEY);
  console.log("Host de API:", process.env.NEXT_PUBLIC_SIV_RAPIDAPIHOST);

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
        Accept: "application/json",
      },
      body: JSON.stringify({
        bucket_name: "siv-pre",
      }),
    });

    console.log("Respuesta:", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    console.log("Segmento obtenido:", segmentIndex);
    console.log("blob:", blob);
    return blob;
  } catch (error: unknown) {
    console.error("Error fetching video segment:", error);
    if (error instanceof Error && error.message.includes("Invalid API key")) {
      alert(
        "La clave de API es inválida. Por favor, revise la configuración de RapidAPI."
      );
    }
    throw error;
  }
};
