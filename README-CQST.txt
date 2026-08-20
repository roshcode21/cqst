CADA QUIEN SU TEMA
LABORATORIO EDITABLE

Sin frameworks, npm ni build step.
Todo se puede editar con Bloc de notas, VS Code o cualquier editor de texto.

DOCUMENTOS ÚTILES

/docs/site-map.md
Mapa actual del sitio y relación entre navegación global, ciclo y artículo.

/docs/analytics.md
Qué significan los eventos de Umami y qué mirar realmente.

/docs/SEO-AEO-GEO.md
Estrategia de descubrimiento, Search, IA generativa, robots, sitemap, RSS y checklist de lanzamiento.

ESTRUCTURA PRINCIPAL

/index.html
Laboratorio. Más adelante será la home real.

/empezar/index.html
Índice del ciclo Empezar.

/empezar/la-fecha-la-ponemos-despues/index.html
Artículo V1 de Rodolfo.
Aquí viven contenido, metadata, notas, bio, audio y navegación de la pieza.

/empezar/digamos-que-empieza-aqui/index.html
Ruta vieja de laboratorio. Redirige a la URL final del artículo.

/privacidad/index.html
Base de privacidad para producción. Revisar antes del lanzamiento público.

/robots.txt
Política de rastreo. Permite OAI-SearchBot y apunta al sitemap.

/sitemap.xml
Inventario de URLs canónicas indexables. Actualizar cuando se publique contenido.

/feed.xml
RSS de CQST. Añadir cada pieza cuando se publica.

/site.webmanifest
Manifest con iconos normales y maskable.

ASSETS

/assets/brand/
Identidad web.
logo-static.png es el lockup estático completo con tagline.

ROLES DEL LOGO EN ARTÍCULO
Header desktop
Muestra solamente el wordmark sin tagline mediante una ventana CSS sobre logo-static.png.

Header móvil
Usa favicon-master-600.png por espacio y legibilidad.

Menú del ciclo
Usa logo-static.png completo con tagline y a color.

Footer global
Usa logo-static.png completo con tagline, pequeño y monocromático mediante CSS.

Favicons
favicon.ico, favicon-32.png y favicon-48.png sirven al navegador.
apple-touch-icon.png sirve a superficies Apple.
icon-192.png e icon-512.png son iconos generales.
icon-maskable-192.png e icon-maskable-512.png son para instalación PWA.
favicon-master-600.png es el master aprobado.
share-empezar-1200x630.png es el preview social provisional del ciclo.

No usar favicon.svg.
No usar logo-static.svg.

/assets/css/base.css
Paleta, tipografía base, selección de texto, links, focus y tokens.

/assets/css/article/layout.css
Header, hero, metadata, audio de entrada, columna de lectura y landmarks de progreso.

/assets/css/article/notes.css
Notas al margen y referencias.

/assets/css/article/voice.css
Bloque La voz con avatar, bio, foto futura y redes.

/assets/css/article/cycle-nav.css
Navegador final y drawer local del ciclo.

/assets/css/article/audio.css
Reproductor persistente y microinteracciones de audio.

/assets/css/article/responsive.css
Tablet, móvil y pantallas estrechas.

/assets/css/site-footer.css
Footer global. No repite la navegación del ciclo.

/assets/js/article/core.js
Estado común, Umami, tiempo de lectura, progreso, compartir y drawer.

/assets/js/article/notes.js
Notas al margen y notas inline.

/assets/js/article/audio.js
Reproducción, timeline, velocidad, Media Session y detección automática del MP3.

/assets/js/article/cycle-nav.js
Preview dinámico del resto del ciclo.

/assets/voices/
Fotos cuadradas de las personas.
Recomendado 500 x 500 px o más.
CSS hace el recorte circular.

Foto prevista para este artículo
/assets/voices/rodolfo.jpg

Mientras no exista se muestran las iniciales RR.
Cuando se suba con ese nombre aparece automáticamente.

/assets/audio/<ciclo>/
Audios organizados por ciclo.

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
Aproximadamente 20 a 30 palabras.
No currículum.
No cargos como sustituto de personalidad.
Debe dejar claro desde dónde habla la persona y cómo mira.

Bio actual de Rodolfo
Diseño, escribo y estudio arquitectura. El trabajo me llevó también a la estrategia y la tecnología. Casi nunca me basta la primera explicación.

AUDIO DEL ARTÍCULO ACTUAL

Ruta exacta
/assets/audio/empezar/rodolfo-la-fecha-la-ponemos-despues.mp3

Para activarlo
1. crea la carpeta empezar dentro de assets/audio si hace falta
2. sube el MP3 con ese nombre exacto
3. nada más

El HTML ya tiene el source.
audio.js detecta automáticamente la metadata, duración y disponibilidad.
No hay que cambiar data-audio-ready ni descomentar código.

IMPORTANTE PARA SEO
Mientras el MP3 no exista no declaramos og:audio ni AudioObject.
Eso evita structured data que apunte a un recurso inexistente.
Cuando se suba el audio se añade esa metadata en la pasada de publicación.

FOOTER GLOBAL

Redes principales visibles
Instagram
TikTok
Facebook reservado como data-stub hasta tener la URL real

Utilidades secundarias
Arriba
RSS
Privacidad

RSS existe aunque sea una función de nicho.
El enlace visible queda deliberadamente en segundo nivel.
El feed también se descubre desde rel=alternate en el head.

LINKS DE LABORATORIO

Durante diseño aceptamos href="#" solo si además lleva data-stub.
Antes del lanzamiento no debe quedar ningún data-stub.

SHARE

El botón usa la hoja nativa del dispositivo cuando está disponible.
La apariencia del preview no la controla navigator.share.
La controlan title, description, Open Graph, favicon, imagen social y apple-touch-icon del head.

La imagen social actual es provisional.
Antes de lanzamiento cada pieza debe tener una imagen 1200 x 630 representativa de esa pieza.

SEO, AEO Y GEO

No perseguimos trucos de AEO o GEO.
La base es contenido original, HTML rastreable, URLs canónicas, enlaces internos claros, fuentes cuando aplican y una experiencia excelente para personas.

El artículo V1 ya prepara
canonical
Open Graph
Twitter Card
Article JSON-LD
Person
Organization
BreadcrumbList
citation
RSS autodiscovery
favicon estable
robots directives

Mientras el sitio siga en github.io, las páginas editoriales continúan con noindex.

ANTES DE LANZAR CADAQUIENSUTEMA.COM

Conectar dominio y HTTPS.
Cambiar noindex por index en home, ciclos y artículos públicos.
Cambiar hosts github.io usados temporalmente en imágenes Open Graph al dominio real.
Eliminar todos los data-stub.
Confirmar title, description, canonical, autor y fecha.
Subir imágenes sociales por artículo.
Subir MP3 disponibles y añadir og:audio + AudioObject donde realmente existan.
Añadir fotos reales de La voz.
Añadir Grift WOFF2 con licencia web.
Crear Website ID de Umami para Producción.
Añadir la home final a sitemap.xml.
Enviar sitemap.xml a Google Search Console y Bing Webmaster Tools.
Probar Share en iPhone, Android y desktop.
Probar 320 CSS px y zoom 200%.
Probar Reduce Motion.
Probar teclado y focus.
