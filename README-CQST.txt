CADA QUIEN SU TEMA — LABORATORIO EDITABLE

No usa frameworks, npm ni build step. Todo se puede editar con Bloc de notas,
VS Code o cualquier editor de texto.

ESTRUCTURA

/index.html
  Laboratorio. Más adelante será la HOME real.

/empezar/index.html
  Índice del ciclo Empezar.

/empezar/digamos-que-empieza-aqui/index.html
  Artículo de Rodolfo. El slug se mantiene estable aunque el título editorial
  todavía cambie. Aquí vive el contenido y la metadata de esta pieza.

/assets/css/base.css
  Paleta, tipografía base, selección de texto, links, focus y tokens.

/assets/css/article/layout.css
  Header, hero, metadata, audio de entrada y columna de lectura.

/assets/css/article/notes.css
  Notas al margen + bloque final de referencias.

/assets/css/article/voice.css
  Firma breve de la voz con avatar, bio y redes.

/assets/css/article/cycle-nav.css
  Navegador final del ciclo + drawer del header.

/assets/css/article/audio.css
  Reproductor persistente y microdestellos editoriales.

/assets/css/article/responsive.css
  Ajustes para tablet, móvil y pantallas muy estrechas.

/assets/js/article/core.js
  Estado común, Umami, tiempo de lectura, progreso, share y drawer.

/assets/js/article/notes.js
  Notas al margen / notas inline.

/assets/js/article/audio.js
  Reproducción, timeline, velocidad, Media Session y analytics del audio.

/assets/js/article/cycle-nav.js
  Preview dinámico de la siguiente pieza + View Transition si existe.

/assets/css/cycle.css + /assets/js/cycle.js
  Índice del ciclo.

/assets/brand/
  logo-static.png          master raster del wordmark estático
  logo-static.svg          versión limpia para web sin fondo blanco
  favicon.svg              favicon simple de anillos
  favicon-32.png
  apple-touch-icon.png

/assets/voices/
  Fotos cuadradas de las personas. Lee README.txt dentro de esta carpeta.

/assets/audio/
  Lee README.txt dentro de esta carpeta.


GRIFT

No guardamos ni distribuimos la tipografía en el repositorio por defecto.
En base.css hay bloques @font-face comentados. Si tienes los .woff2 con la
licencia web adecuada, colócalos en /assets/fonts/ y descomenta esas reglas.


COPY VISIBLE DE CQST

- Evitar guion largo como recurso de redacción.
- Evitar dos puntos como recurso estilístico.
- Usar comas con moderación.
- No escribir microcopy que explique obviedades de la interfaz.
- No usar “próximamente” como relleno.
- Los placeholders del laboratorio deben verse deliberadamente provisionales.
- Las referencias académicas conservan la puntuación que necesiten.


CÓMO DUPLICAR UN ARTÍCULO

1. Duplica la carpeta del artículo.
2. Renómbrala con el nuevo slug.
3. En index.html busca el comentario "EDITA ESTO EN CADA ARTÍCULO".
4. Cambia title, description, canonical, Open Graph, Twitter y JSON-LD.
5. Cambia h1, autor, fecha, deck, texto y notas.
6. Cambia el bloque LA VOZ con foto, bio y redes reales.
7. Ajusta las tres entradas del navegador final del ciclo.
8. Si existe audio, sigue /assets/audio/README.txt.
9. Antes de producción asigna una imagen social raster 1200x630 en og:image.


AUDIO DEL ARTÍCULO ACTUAL

Ruta prevista
/assets/audio/empezar/rodolfo-la-fecha-la-ponemos-despues.mp3

Cuando exista el MP3
1. súbelo exactamente en esa ruta;
2. abre /empezar/digamos-que-empieza-aqui/index.html;
3. cambia data-audio-ready="false" por data-audio-ready="true";
4. descomenta la línea <source> dentro de #articleAudio.

La duración se obtiene automáticamente de la metadata del MP3.


RUTAS

/                                  home, laboratorio por ahora
/empezar/                          índice del ciclo
/empezar/digamos-que-empieza-aqui/ artículo estable de Rodolfo

El logo del header siempre vuelve a /.
"Ver ciclo" siempre vuelve al índice del ciclo /empezar/.


LINKS DE LABORATORIO

Durante diseño aceptamos href="#" SOLO si además lleva data-stub.
Eso nos deja diseñar los estados reales antes de tener todas las URLs.
Antes del lanzamiento no debe quedar ningún data-stub.


ANTES DE LANZAR CADAQUIENSUTEMA.COM

- Quitar noindex,nofollow.
- Sustituir todos los data-stub por URLs reales.
- Cambiar canonical y og:url a cadaquiensutema.com.
- Sustituir og:image por una imagen raster 1200x630 por artículo.
- Confirmar title, description, autor y fecha.
- Conectar cada MP3 disponible.
- Añadir las fotos reales de cada voz.
- Añadir Grift webfont .woff2 con su licencia web.
- Crear Website ID de Umami para PRODUCCIÓN separado del Lab.
- Probar Share en iPhone / Android / desktop.
- Probar 320 CSS px y zoom 200%.
- Probar Reduce Motion.
- Probar teclado y focus.
- Probar previews de WhatsApp / Facebook / LinkedIn una vez conectado el dominio.