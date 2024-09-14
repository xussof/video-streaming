1. Primer paso: Reproducir el indice del video (video completo).

He tenido que crear la carpeta public y pasar allí los
archivos que estaban en static, ya que sino, no podía leerlos.

Al hacer esto, he conseguido reproducir el archivo indice del video .m3u8.

**He utilizado la libreria react-player configurada para HLS**

``
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
``

- url: Especifica la URL de origen del video.

- controls: Cuando se establece en true, agrega controles de video al reproductor.

- width y height: Establecen las dimensiones del reproductor de video.

- playing: Una propiedad booleana que determina si el video debe comenzar a reproducirse inmediatamente.

- config: Un objeto que contiene opciones de configuración para el reproductor.

- onError: Una función de llamada-back que se ejecutará si hay un error al reproducir el video.

**Opciones de config**:

- file.hlsOptions: Estas son opciones específicas para videos HLS (HTTP Live Streaming).

- autoStartLoad: Si se establece en true, comienza automáticamente a cargar el video.

- startPosition: Establece la posición inicial del video en segundos. -1 significa que comenzará desde el principio.

- maxBufferLength: Longitud máxima del buffer en segundos.

- liveSyncDurationCount: Número de segundos para sincronizarse con el flujo en vivo antes de empezar la reproducción.

- maxMaxBufferLength: Longitud máxima permitida total del buffer en segundos.

- backBufferLength: Longitud del buffer de fondo en segundos.

p. maxBufferHole: Hueso de buffer máximo permitido en segundos.

- maxStarvationDelay: Retraso máximo entre eventos de hambre en milisegundos.

- maxLoadingDelay: Retraso máximo permitido de carga en segundos.

- **(Read Buffer)**:
Es el área de memoria donde se almacenan los datos del video que están siendo procesados y reproducidos.
Tiene un tamaño limitado por `maxBufferLength`.
- **(Write Buffer)**:
Es el área de memoria donde se almacenan los datos del video que aún no han sido reproducidos.
Tiene un tamaño limitado por `maxMaxBufferLength`.
- - **(Back Buffer)**:
Es el área de memoria donde se almacenan los datos del video que ya han sido reproducidos pero aún no han sido eliminados.
Tiene un tamaño limitado por `backBufferLength`.
**(Buffer Hole)**:
Es el espacio entre el final del buffer de lectura y el inicio del buffer de escritura.
Tiene un valor máximo de `maxBufferHole`.

**Funcionamiento esperado**:

- Carga automática: El video comienza a cargar automáticamente cuando se abre la página.
- Buffering: El reproductor mantiene hasta 30 segundos de video en el buffer de lectura.
- Sincronización con flujo en vivo: Si el video es un flujo en vivo, el reproductor sincroniza cada 3 segundos para mantenerse actualizado.
- Manejo de memoria: El buffer de fondo mantiene hasta 30 segundos de video cargado previamente, lo cual puede ser útil para evitar pausas durante la reproducción.
- Control de retardo: Los parámetros de retardo ayudan a optimizar la carga y reproducción del video, evitando que se quede bloqueado por largos periodos.
- Controles básicos: Hay un botón para alternar entre play/pause.

- La otra opción era crear un middleware para servir los archivos estaticos desde otra ubicación, lo cual no tiene sentido ya que vendran de la API.

2. Siguiente paso: configurar las opciones de hls y conseguir servir el video cada 10 segundos.

Añado logica para el boton de play/pause, añado prop playing al reproductor. Con este botón se inicia el video y se pausa, lo cual cancela la descarga de siguientes partes. Esto viene dado de las props de reac-player. *Consultar que otros botones necesitamos*
El video se puede reproducir en pantalla completa y en ventana popup.

URL de las codiguraciones para modificar la descarga de fragmentos, etc. [https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning]