1. Primer paso: Reproducir el indice del video (video completo).

He tenido que crear la carpeta public y pasar allí los
archivos que estaban en static, ya que sino, no podía leerlos.

Al hacer esto, he conseguido reproducir el archivo indice del video .m3u8.

**He utilizado la libreria react-player configurada para HLS**

`
 config={{
          file: {
            hlsOptions: {
              autoStartLoad: true,
              startPosition: -1,
              maxBufferLength: 7.5,
              liveSyncDurationCount: 3,
              maxMaxBufferLength: 600,
              backBufferLength: 30,
              maxBufferHole: 0.1,
              maxStarvationDelay: 4,
              maxLoadingDelay, 
            },
          },
        }}
`

La otra opción era crear un middleware para servir los archivos estaticos desde otra ubicación, lo cual no tiene sentido ya que vendran de la API.

2. Siguiente paso: configurar las opciones de hls y conseguir servir el video cada 10 segundos.

Añado logica para el boton de play/pause, añado prop playing al reproductor. Con este botón se inicia el video y se pausa, lo cual cancela la descarga de siguientes partes. Esto viene dado de las props de reac-player. *Consultar que otros botones necesitamos*
El video se puede reproducir en pantalla completa y en ventana popup.

URL de las codiguraciones para modificar la descarga de fragmentos, etc. [https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning]