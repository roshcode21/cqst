CADA QUIEN SU TEMA · AUDIO

Convención
assets/audio/<ciclo>/<autor>-<slug>.mp3

Este artículo
assets/audio/empezar/rodolfo-la-fecha-la-ponemos-despues.mp3

Cómo conectarlo
1. Entra a /assets/audio/empezar/
2. Sube exactamente
   rodolfo-la-fecha-la-ponemos-despues.mp3
3. Nada más

El HTML del artículo ya apunta a esa ruta.
/assets/js/article/audio.js detecta automáticamente si el archivo existe y lee su metadata.

Cuando el MP3 esté disponible se activan
- duración real
- play y pausa
- timeline
- velocidad
- reproductor persistente
- Media Session en dispositivos compatibles
- eventos de Umami

No escribas la duración manualmente.
No hay que editar data-audio-ready.
No hay que descomentar ningún source.
Nunca autoplay.

Para detalles específicos de este ciclo consulta
/assets/audio/empezar/README.txt
