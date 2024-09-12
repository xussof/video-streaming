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
              maxBufferLength: 30,
              liveSyncDurationCount: 3,
              maxMaxBufferLength: 600,
            },
          },
        }}
`

La otra opción era crear un middleware para servir los archivos estaticos desde otra ubicación, lo cual no tiene sentido ya que vendran de la API.

2. Siguiente paso: configurar las opciones de hls y conseguir servir el video cada 10 segundos.