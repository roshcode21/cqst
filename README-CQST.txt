CADA QUIEN SU TEMA — LABORATORIO EDITABLE

No usa frameworks, npm ni build step. Todo se puede editar con Bloc de notas,
VS Code o cualquier editor de texto.

ESTRUCTURA

/index.html
  Laboratorio. Más adelante será la HOME real.

/empezar/index.html
  Índice del ciclo Empezar.

/empezar/la-fecha-la-ponemos-despues/index.html
  Artículo de Rodolfo. Aquí vive el contenido y la metadata de esta pieza.

/assets/css/base.css
  Paleta, tipografía base, selección de texto, links, focus y tokens.

/assets/css/article/layout.css
  Header, hero, metadata, audio de entrada y columna de lectura.

/assets/css/article/notes.css
  Notas al margen + bloque final de referencias.

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
  logo-static.svg          wordmark oficial del header de artículos
  favicon.svg              favicon simple de anillos
  favicon-32.png
  apple-touch-icon.png
  icon-192.png
  icon-512.png

/assets/audio/
  Lee README.txt dentro de esta carpeta.

/assets/social/
  Imágenes 1200x630 para previews al compartir.


GRIFT

No guardamos ni distribuimos la tipografía en el repositorio por defecto.
En base.css hay bloques @font-face comentados. Si tienes los .woff2 con la
licencia web adecuada, colócalos en /assets/fonts/ y descomenta esas reglas.


CÓMO DUPLICAR UN ARTÍCULO

1. Duplica la carpeta del artículo.
2. Renómbrala con el nuevo slug.
3. En index.html busca el comentario "EDITA ESTO EN CADA ARTÍCULO".
4. Cambia title, description, canonical, OG, Twitter y JSON-LD.
5. Cambia h1, autor, fecha, texto y notas.
6. Ajusta las tres entradas del navegador final del ciclo.
7. Si existe audio, sigue /assets/audio/README.txt.
8. Genera una imagen social 1200x630 y actualiza og:image / twitter:image.


RUTAS

/                         home (laboratorio por ahora)
/empezar/                 índice del ciclo
/empezar/<slug>/          artículo

El logo del header siempre vuelve a /.
"Ver el ciclo completo" siempre vuelve al índice del ciclo: /empezar/.


LINKS DE LABORATORIO

Durante diseño aceptamos href="#" SOLO si además lleva data-stub.
Eso nos deja diseñar los estados reales antes de tener todas las URLs.
Nunca usamos “próximamente” como relleno.
Antes del lanzamiento no debe quedar ningún data-stub.


ANTES DE LANZAR CADAQUIENSUTEMA.COM

- Quitar noindex,nofollow.
- Sustituir todos los data-stub por URLs reales.
- Confirmar canonical y og:url.
- Confirmar og:image absoluta 1200x630.
- Confirmar title, description, autor y fecha.
- Conectar cada MP3 disponible.
- Crear un Website ID de Umami para PRODUCCIÓN (separado del Lab).
- Probar Share en iPhone / Android / desktop.
- Probar 320 CSS px y zoom 200%.
- Probar Reduce Motion.
- Probar teclado y focus.
- Probar previews de WhatsApp / Facebook / LinkedIn una vez conectado el dominio.