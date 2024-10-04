import axios from "axios";

export const getVideoSegment = async (
  videoId: string,
  segmentIndex: number
): Promise<Blob> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_SIV_URL}api/scaleway-watch-hls-segment/${videoId}/${segmentIndex}`;

  console.log("URL de segmento:", apiUrl);

  // const apiHost = process.env.NEXT_PUBLIC_SIV_RAPIDAPIHOST;
  // const apiKey = process.env.NEXT_PUBLIC_SIV_RAPIDAPIKEY;
  // const userKey = process.env.NEXT_PUBLIC_SERVICE_USER_MANAGEMENT_KEY;

  try {
    const response = await axios.post(
      apiUrl,
      { bucket_name: "siv-pre" },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "cloudsolute-pre.p.rapidapi.com",
          "X-RapidAPI-Key":
            "c47807e6e4msh1064e0320d58bb2p1e17d2jsn00995ba034f8",
          "user-management-key": "gHrggF34u7GS1FY1h4kUfOIkXOyapZqw",
          Accept: "/",
        },
        responseType: "blob",
      }
    );

    console.log("Respuesta:", response);

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    console.log("Tipo del blob:", blob.type);
    console.log("Tamaño del blob:", blob.size);
    console.log("Segmento obtenido:", segmentIndex);
    console.log("blob:", blob);

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
