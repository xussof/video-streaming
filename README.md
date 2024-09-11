# video-streaming
Repo para ver videos propiedad de cloudsolute


## Descripcion:

Poder ver videos propios de CloudSolute que no estan ubicados en ninguna paltaforma tipo youtube, vimeo, etc.

### Explicación de como estan ubicados los archivos en s3:

Los archivos estan almacenados en un bucket de S3 de Scaleway de la siguiente manera:

Dentro del directorio de cloudsolute se encuentran los directorios de los diferentes videos con los id's unicos autogenerados en el proceso de carga de los videos. Dicho id es unico y esta creado en base al checksum del video por lo que si se vuelve a subir el video sabremos si estna subiendo varias veces el mismo video.

![](/static/screenshoots/1.png)

Si entramos en uno de los directorios de los videos veremos que hay dos directorios, uno llamado raw y otro video. 

![](/static/screenshoots/2.png)

En raw se encuentra el video completo tal qual lo subio el usuario, sin particionar. 
En video se encuentran las diferentes partes en las que se ha dividido el video y el archivo .m3u8 que contiene el indice de las partes del video.

![](/static/screenshoots/3.png)

Dentro de parts se encuentran las diferentes partes del video con extension .ts

![](/static/screenshoots/4.png)

### Info sobre las APIS para poder ver los videos:

(Nota: Las urls localhost:5000 son las urls de retype, para ver la docu privada arranca el servidor de retype https://github.com/xussof/docs-cloudsolute-private/tree/main )
Podremos descargarnos las diferentes partes del video usando las siguientes urls de API:

Para obtener el indice del video:
http://localhost:5000/2--api-documentation/private-apis/streaming/watch-video/

Para descargarse las partes del video:



### Información sobre el video:
- id del video: "vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps"


### Como proceder:

Paso 1 hacer que funcione sin llamadas a la api:
- Con el indice y las partes del video descargadas, intentar ver el video en el navegador.
- Hacer los botones de play, pause, stop, etc. (Que sean cuanto mas simples mejor, sin css solo funcionalidad)

Paso 2 hacer que funcione con llamadas a la api:
- Primero al dar clic al boton buscar, se descarge el indice y la primera parte del video.
- Cuando se de clic al boton play, se descarguen las siguientes partes del video a medida que se vaya reproduciendo el video. Es decir cuando se de clic al boton play, se descargue la parte 2 del video y cuando se llegue a la 3/4 parte del fragmento (*) se descargue la parte 3 del video, etc.

* Explicación de la 3/4 parte del fragmento: Si el fragmento dura 10 segundos, se descargara la parte 3 del video cuando se haya reproducido 7.5 segundos del fragmento. El tiempo de cada fragmento lo puedes obtener del indice del video, "video-streaming/static/video/vid-pY2YksEoisvin72JDP7fZP15g7qGJpJudsF9RLtsps.m3u8"

Paso 3:
- Hacer que podamos arrastrar la barra de reproducción del video y que se descarguen las partes del video necesarias para poder ver el video en ese segundo.


Paso 4:
- Modificar codigo para que no se descarge solo la siguiente parte del video, sino que se descargen X (En vez de uno define una variable que iremos refinando con el tiempo para saber que es mejor) partes del video a la vez. 
- Modificar codigo para que se descargen la ssiguientes partes cuando lleguemos a la X (cambiar lo que teniamos por 3/4 partes por una variable que iremos definiendo a saber si hacer que descargue cuando vamos 1/4, 2/4, etc tendremos que hacer pruebas de rendimiento) parte del video

### Objetivos de la tarea:
Por tanto la tarea consta de varias partes:
1 Poder ver el video en el navegador usando las partes que nos hayamos descargado junto al indice.
2 Hacer un reproductor de video que permita ver el video en el navegador con los botones de play, pause, stop, etc. Mirar si hay alguna libreria de next para ello.
3 Poder descargar las partes del video a traves de la api
4 Si me muevo manualmente al segundo X quiero quiero que el navegador haga el calculo de que partes del video necesita descargar para poder ver el video en ese segundo.(Hacer calculo en base al indice del video donde aparece el tiempo de cada fragmento)
5 Definir una variable que nos permita definir cuantas partes del video queremos descargar a la vez.
6 Definir una variable que nos permita definir cuando queremos que se descarguen las siguientes partes del video. (Por ejemplo cuando se haya reproducido 1/4 del fragmento)
7 Hacer pruebas de rendimiento para saber que es mejor, si descargar las partes del video cuando se haya reproducido 1/4, 2/4, etc del fragmento.