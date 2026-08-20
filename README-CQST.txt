CADA QUIEN SU TEMA
LABORATORIO EDITABLE

Sin frameworks, npm ni build step.
Todo se puede editar con Bloc de notas, VS Code o cualquier editor de texto.

DOCUMENTOS ÚTILES

/docs/SITEMAP-CQST.txt
Mapa oficial de navegación.

/docs/ANALITICS-CQST.txt
Qué significan los eventos de Umami y qué mirar realmente.

ESTRUCTURA PRINCIPAL

/index.html
Laboratorio. Más adelante será la home real.

/empezar/index.html
Índice del ciclo Empezar.

/empezar/digamos-que-empieza-aqui/index.html
Artículo de Rodolfo. El slug se mantiene estable aunque el título editorial cambie.
Aquí viven contenido, metadata, notas, bio y navegación de la pieza.

/assets/brand/
Identidad web.
logo-static.svg es un vector real del wordmark estático aprobado.
favicon.svg es el favicon de círculos.

/assets/css/base.css
Paleta, tipografía base, selección de texto, links, focus y tokens.

/assets/css/article/layout.css
Header, hero, metadata, audio de entrada y columna de lectura.

/assets/css/article/notes.css
Notas al margen y referencias.

/assets/css/article/voice.css
Bloque La voz con avatar, bio y redes.

/assets/css/article/cycle-nav.css
Navegador final y drawer del ciclo.

/assets/css/article/audio.css
Reproductor persistente y microinteracciones de audio.

/assets/css/article/responsive.css
Tablet, móvil y pantallas estrechas.

/assets/js/article/core.js
Estado común, Umami, tiempo de lectura, progreso, compartir y drawer.
También contiene el mapa de nombres legibles de Analytics.

/assets/js/article/notes.js
Notas al margen y notas inline.

/assets/js/article/audio.js
Reproducción, timeline, velocidad, Media Session y eventos de audio.

/assets/js/article/cycle-nav.js
Preview dinámico del resto del ciclo.

/assets/voices/
Fotos cuadradas de las personas.
Recomendado 500 x 500 px.
CSS hace el recorte circular.

/assets/audio/
Audios por ciclo.

/assets/social/
Imágenes raster para compartir.
Cada artículo debe tener una imagen 1200 x 630.

GRIFT

No guardamos ni distribuimos la tipografía en el repositorio por defecto.
En base.css están previstos los bloques @font-face.
Cuando tengas los WOFF2 con licencia web colócalos en /assets/fonts/.

COPY VISIBLE DE CQST

Evitar guion largo como recurso de redacción.
Evitar dos puntos como muletilla estilística.
Usar comas con moderación.
No escribir microcopy que explique obviedades.
No usar “próximamente”.
Los placeholders de Lab deben verse deliberadamente provisionales.
Las referencias académicas conservan la puntuación que necesiten.

BIO DE LA VOZ

Primera persona.
Ideal 15 a 22 palabras.
Aproximadamente 80 a 140 caracteres.
No currículum.
No cargos como sustituto de personalidad.
Una pista de qué hace la persona y otra de cómo mira.

Ejemplo actual de Rodolfo
Diseño, escribo y estudio arquitectura. Casi siempre llego a una pregunta por más de un camino.

AUDIO DEL ARTÍCULO ACTUAL

Ruta prevista
/assets/audio/empezar/rodolfo-la-fecha-la-ponemos-despues.mp3

Cuando exista el MP3
1. súbelo en esa ruta
2. abre el index.html del artículo
3. cambia data-audio-ready="false" por data-audio-ready="true"
4. descomenta el source dentro de articleAudio

La duración se obtiene automáticamente de la metadata del MP3.

LINKS DE LABORATORIO

Durante diseño aceptamos href="#" solo si además lleva data-stub.
Antes del lanzamiento no debe quedar ningún data-stub.

SHARE

El botón usa la hoja nativa del dispositivo cuando está disponible.
La apariencia del preview NO la controla navigator.share.
La controlan title, description, Open Graph, favicon y apple-touch-icon del head.

Cada artículo necesita una imagen social raster 1200 x 630.
No usar el favicon cuadrado como og:image.

ANTES DE LANZAR CADAQUIENSUTEMA.COM

Quitar noindex,nofollow.
Cambiar canonical y og:url al dominio real.
Eliminar todos los data-stub.
Subir favicon raster actualizado y apple-touch-icon.
Subir imagen social 1200 x 630 por artículo.
Confirmar title, description, autor y fecha.
Conectar MP3 disponibles.
Añadir fotos reales de La voz.
Añadir Grift WOFF2 con licencia web.
Crear Website ID de Umami para Producción.
Probar Share en iPhone, Android y desktop.
Probar 320 CSS px y zoom 200%.
Probar Reduce Motion.
Probar teclado y focus.
