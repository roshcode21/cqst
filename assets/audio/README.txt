CADA QUIEN SU TEMA — AUDIO

Convención
assets/audio/<ciclo>/<autor>-<slug-del-articulo>.mp3

Este artículo
assets/audio/empezar/rodolfo-la-fecha-la-ponemos-despues.mp3

Cómo conectarlo
1. Crea la carpeta /assets/audio/empezar/ si todavía no existe.
2. Copia ahí:
   rodolfo-la-fecha-la-ponemos-despues.mp3
3. Abre:
   /empezar/la-fecha-la-ponemos-despues/index.html
4. Busca:
   data-audio-ready="false"
5. Cámbialo por:
   data-audio-ready="true"
6. Descomenta el <source> que ya está preparado.

No escribas la duración manualmente.
/assets/js/article/audio.js lee la duración desde la metadata del MP3.

Al conectar el dominio real, si quieres que el audio también quede declarado
para plataformas compatibles, puedes añadir en <head>:
<meta property="og:audio" content="https://cadaquiensutema.com/assets/audio/empezar/rodolfo-la-fecha-la-ponemos-despues.mp3">
<meta property="og:audio:type" content="audio/mpeg">

Nunca autoplay.