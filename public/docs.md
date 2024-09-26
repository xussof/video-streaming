## 1. Primer paso: Reproducir el indice del video (video completo).

He creado la carpeta public y pasado allí los
archivos que estaban en static, ya que sino, no podía leerlos.

Al hacer esto, he conseguido reproducir el archivo indice del video .m3u8.

**He utilizado la libreria react-player configurada para HLS**

```
 url={videoUrl}
        controls={true}
        width={640}
        height={360}
        playing={playing}
        config={{
          file: {
            hlsOptions: {
              autoStartLoad: true,
              startPosition: -1,
              maxBufferLength: 30,
              liveSyncDurationCount: 3,
              maxMaxBufferLength: 10,
              backBufferLength: 10,
              maxBufferHole: 0.1,
              maxStarvationDelay: 4,
              maxLoadingDelay: 0.5,
            },
          },
        }}
```

- **url**: Especifica la URL de origen del video.

- **controls**: Cuando se establece en true, agrega controles de video al reproductor.

- **width y height**: Establecen las dimensiones del reproductor de video.

- **playing**: Una propiedad booleana que determina si el video debe comenzar a reproducirse inmediatamente.

- **light**: Imagen que aparece antes de reproducirse el video (miatura de video). Con esta propiedad, el boton START queda obsololeto ya que viene añadido en la imagen, cuando se le da al boton en el centro de la imagen, aparece el video y la primera carga, con el boton play pause se inicia o pausa el video, lo que tambien inicia o pausa segun el caso, la carga de partes. De este boton extra tambien se podría prescindir ya que viene con los controles del reproductor, o eliminar los controles del reproductor y tener los propios.

- **config**: Un objeto que contiene opciones de configuración para el reproductor.

- **onError**: Una función de llamada-back que se ejecutará si hay un error al reproducir el video.

**Apuntes buffer**: 
- **(Read Buffer)**:
Es el área de memoria donde se almacenan los datos del video que están siendo procesados y reproducidos.
Tiene un tamaño limitado por `maxBufferLength`.
- **(Write Buffer)**:
Es el área de memoria donde se almacenan los datos del video que aún no han sido reproducidos.
Tiene un tamaño limitado por `maxMaxBufferLength`.
- **(Back Buffer)**:
Es el área de memoria donde se almacenan los datos del video que ya han sido reproducidos pero aún no han sido eliminados.
Tiene un tamaño limitado por `backBufferLength`.
- **(Buffer Hole)**:
Es el espacio entre el final del buffer de lectura y el inicio del buffer de escritura.
Tiene un valor máximo de `maxBufferHole`.

### **Funcionamiento esperado**:

- Carga automática: El video comienza a cargar automáticamente cuando se abre la página.
- Buffering: El reproductor mantiene hasta 30 segundos de video en el buffer de lectura.
- Sincronización con flujo en vivo: Si el video es un flujo en vivo, el reproductor sincroniza cada 3 segundos para mantenerse actualizado.
- Manejo de memoria: El buffer de fondo mantiene hasta 30 segundos de video cargado previamente, lo cual puede ser útil para evitar pausas durante la reproducción.
- Control de retardo: Los parámetros de retardo ayudan a optimizar la carga y reproducción del video, evitando que se quede bloqueado por largos periodos.
- Controles básicos: Hay un botón para alternar entre play/pause.

- La otra opción era crear un middleware para servir los archivos estaticos desde otra ubicación, lo cual no tiene sentido ya que vendran de la API.

## 2. Siguiente paso: configurar las opciones de hls y conseguir servir el video cada 10 segundos.

Añado logica para el boton de play/pause, añado prop playing al reproductor. Con este botón se inicia el video y se pausa, lo cual cancela la descarga de siguientes partes. Esto viene dado de las props de reac-player. *Consultar que otros botones necesitamos*
El video se puede reproducir en pantalla completa y en ventana popup.

URL de las codiguraciones para modificar la descarga de fragmentos, etc. [https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning]

Con estas configuraciones, el comportamiento requerido debería ser eficiente, a falta de pruebas de rendimiento. Si con las configuraciones de hls.js y react-player no tenemos suficiente, existe la opcion de modificar el comportamiento por defecto de la carga de segmentos.

```
"use client";
import { useState } from "react";
import ReactPlayer from "react-player";

export const VideoPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const videoUrl = "/video/vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps.m3u8";
  const videoImage = "/thumbnails.jpg";

  const handleError = (error: unknown) => {
    console.error("Error playing video:", error);
  };

  const handlePlaying = () => {
    setPlaying(!playing);
  };

  return (
    <div id="player" className="m-8 h-full">
      <ReactPlayer
        url={videoUrl}
        controls={true}
        width={640}
        height={360}
        playing={playing}
        light={videoImage}
        config={{
          file: {
            hlsOptions: {
              autoStartLoad: true,
              startPosition: -1,
              maxBufferLength: 15, 
              liveSyncDurationCount: 1, 
              maxMaxBufferLength: 10,
              backBufferLength: 10,
              maxBufferHole: 0.1,
              maxStarvationDelay: 4,
              maxLoadingDelay: 0.5,
              fpsDroppedMonitoringPeriod: 2000, // Monitorea cada 2 segundos
              fpsDroppedMonitoringThreshold: 0.2, // Considera que los FPS han caído si bajan un 20%
            },
          },
        }}
        onError={handleError}
      />
      <button onClick={handlePlaying}>{playing ? "Pause" : "Play"}</button>
    </div>
  );
};
```

### HLS CONFIG

#### autoStartLoad: true
Comienza automáticamente a cargar el video cuando se inicializa el reproductor.

#### startPosition: -1
Inicia la reproducción desde el principio del video (-1 significa posición inicial).

#### maxBufferLength: 15
Establece un máximo de 15 segundos de video en búfer. Esto controla cuánto tiempo de video se carga por adelantado.

#### liveSyncDurationCount: 1
Carga solo el primer segmento inicialmente, lo que permite un inicio rápido del video.

#### maxMaxBufferLength: 10
Limita el búfer máximo a 10 segundos para evitar cargar demasiado adelante.

#### backBufferLength: 10
Permite un búfer posterior de hasta 10 segundos. Esto ayuda a mantener la reproducción suave.

#### maxBufferHole: 0.1
Establece un hueco máximo de 0.1 segundos entre fragmentos. Menores valores dan una reproducción más fluida.

#### maxStarvationDelay: 4
Si no se pueden cargar nuevos datos durante 4 segundos, se considera que hay un problema.

#### maxLoadingDelay: 0.5
Si un fragmento tarda más de 0.5 segundos en cargar, se considera que hay un problema.

#### fpsDroppedMonitoringPeriod: 2000
Monitorea los frames por segundo cada 2 segundos (2000 milisegundos).

#### fpsDroppedMonitoringThreshold: 0.2
Considera que los FPS han caído si bajan un 20% en el período de monitoreo.

#### abrController
Este objeto configura el controlador de bitrate adaptable (ABR):

- enabled: true - Activa el controlador ABR.
- bandwidth: 5 - Establece el ancho de banda objetivo en 5 Mbps.
- minRebuffer: 0.5 - Mínimo de 0.5 segundos de re-búfer.
- maxRebuffer: 2 - Máximo de 2 segundos de re-búfer.
- minBuffer: 0.5 - Mínimo de 0.5 segundos de búfer.
- maxBuffer: 2 - Máximo de 2 segundos de búfer.
- minBufferTime: 0.5 - Tiempo mínimo de búfer en segundos.
- maxBufferTime: 2 - Tiempo máximo de búfer en segundos.

## APIs

- La llamada a la api watch video trae el indice completo y tambien lo modifico a una url para que sirva las partes, por ahora, este paso no funciona, cuando hago click en la url de una parte, lanza este error en el navegador:
```
Failed to load resource: the server responded with a status of 429 ()
{
  "message": "Invalid API key. Go to https://docs.rapidapi.com/docs/keys for more info."
}
```
- En la api de watch segments he creado la llamada, pero como no funcionan las urls aun no lo puedo probar.

- En el componente VideoPlayer, aparece el reproductor pero no hace nada, he ido modificando la logica hasta descubrir que esta fallando la carga de segmentos, sigo trabajando en ello.


- El error está en la construcción de las urls de las los segmentos del video, estaba pasando el string del index, estoy en ello, ahora he dejado que videoId sea un number y le he pasado el 1, falta construir la URL y probar si funciona.

- Retiro la libreria m3u8-parse, intento crear las urls separando los segmentos de video, no conseguido, sigo en ello.

- Consigo crear un arry con las urls de los segmentos y con su indice, pero veo que la url de los segmentos solo lleva el videoindex y /0, /1, etc.
Necesito conseguir esa url.

- He conseguido la url correcta para los segmentos, pero estoy bloqueada, no consigo reproducir el video

## Debo revisar la confguración hls de la libreria react-player, parece venir de ahi el error.

Añado console.logs para intentar identificar porque no se reproduce el video, segmentUrls y videoUrls al principio son arrays vacios pero luego veo que se carga el segmento blob y la url del segmento. El blob es localhost, debo revisar si esto debe ser asi o no. Las respuestas de la API, tipo de blob, segmento obtenido, son correctos. El array de videoUrls que recibe el reproductor contiene blobs, no se si esto debe ser asi, ya que ademas son localhost. 

**Siguiente paso investigar sobre blob, saber si estoy recibiendo las urls correctas en formato y sirviendolas de forma correcta al reproductor. En este punto, se visualiza el reproductor en pantalla, pero no funciona. **