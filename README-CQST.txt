CADA QUIEN SU TEMA
LABORATORIO EDITABLE · V3

Sin frameworks, npm ni build step.
Todo se puede editar con Bloc de notas, VS Code o cualquier editor de texto.

ARQUITECTURA GLOBAL

/                  Portada
/temas/            todos los ciclos
/voces/            participantes y piezas
/cqst/              qué es CQST, ciclos, voces, Homo narrans, símbolo y contacto
/empezar/           ciclo Empezar
/empezar/la-fecha-la-ponemos-despues/   artículo V1 cerrado
/privacidad/        privacidad
/feed.xml           RSS
/sitemap.xml        sitemap
/robots.txt         robots

RUTAS ANTIGUAS DE LAB

/explorar/ redirige a /temas/
/revista/ redirige a /cqst/
/empezar/digamos-que-empieza-aqui/ redirige al slug final del artículo

NAVEGACIÓN V3

Desktop usa un dock flotante con
Portada · Temas · Voces · CQST

Mobile usa navegación inferior con los mismos cuatro destinos.
No comprimimos el layout desktop para móvil. Las voces del ciclo actual se vuelven un deck horizontal con scroll snap.

El shell adapta su contraste según data-shell-tone en cada superficie.

El artículo NO adopta este shell. Su interfaz de lectura se mantiene independiente.

HOME V3

1. kinetic logo
2. explicación mínima y factual
3. ciclo actual
4. explicación breve de CQST
5. dos acciones finales
   - volver en el siguiente ciclo
   - proponer un tema
6. footer

No usamos un hero fotográfico como sistema.
Las fotografías pertenecen a las voces cuando existan.

KINETIC

Masters en
/assets/brand/kinetic/

Logo.png
2.png
3.png
4.png
5.png
6.png
7.png
8.png
9.png

El loop mantiene velocidad constante.
Desktop se detiene mientras el cursor está sobre el logo.
Touch alterna pausa y reproducción al tocar.
prefers-reduced-motion muestra un estado estático.

TIPOGRAFÍA

Grift sigue siendo la tipografía oficial de identidad y UI.
Los WOFF2 con licencia web irán en /assets/fonts/.

V3 introduce Newsreader para lectura editorial en home e interiores.
El artículo V1 no cambia de tipografía en esta etapa.

PALETA

--cqst-blue      marca y navegación
--cqst-green     vivo, leído, confirmado
--cqst-orange    audio y escucha
--cqst-purple    contexto, ideas laterales y algunas acciones editoriales
--cqst-yellow    foco y aparición excepcional
--cqst-paper     fondo editorial
#FFFFFF          hojas y superficies de voz
--cqst-night     profundidad y footer

Los neones funcionan como acciones y estados. No hace falta convertir cada color en una sección de pantalla completa.

ASSETS PRINCIPALES

/assets/brand/
identidad, logo, favicons y social previews

/assets/css/shell.css
navegación global V3 y footer

/assets/js/shell.js
contraste adaptativo del dock y comportamiento mobile

/assets/css/home.css
Portada V3

/assets/js/home.js
kinetic, estado de lectura, deck móvil y formulario lab

/assets/css/interior.css
Temas, Voces, CQST y ciclo

/assets/voices/
fotos de participantes

/assets/audio/<ciclo>/
audios por ciclo

ARTÍCULO V1

No modificar su estructura desde V3.

Foto prevista
/assets/voices/rodolfo.jpg

Audio previsto
/assets/audio/empezar/rodolfo-la-fecha-la-ponemos-despues.mp3

Cuando el MP3 exista, audio.js lo detecta automáticamente.

COPY CQST

Evitar guion largo como muletilla.
Evitar dos puntos como recurso repetitivo.
Evitar frases plantilla y oposiciones del tipo “no X, sino Y” como fórmula de copy.
No escribir microcopy que explique obviedades.
No usar “próximamente”.
No numerar ciclos ni voces en la interfaz pública.
No usar About us, Archivo, Artículos o Contacto como navegación principal.

TEMAS

La portada solo pone un ciclo en primer plano.
Cuando llegue Dinero, Empezar baja a /temas/ y se conserva completo.
No añadimos filtros hasta que el volumen los haga útiles.

VOCES

/voces/ permite recorrer el proyecto por personas.
No hace falta abrir perfiles individuales desde el primer día.
Cuando una persona acumule varias piezas, la arquitectura permite crecer a una URL propia.

CQST

/cqst/ abre con
… ¿y quién pregunta?

Ahí viven
cómo funcionan los ciclos
cómo elegimos voces
Homo narrans
el símbolo
quién edita esta primera etapa
contacto
propuesta de temas

Correo público
hola@cadaquiensutema.com

Propuesta de tema
mailto con asunto
Tengo un tema para CQST

NEWSLETTER

Copy V3
¿Te quedas para el siguiente?
Te escribimos cuando abra un ciclo nuevo.
Un correo por ciclo.

CTA
Avísame →

En laboratorio el formulario no guarda correos todavía.
Antes de producción conectar un proveedor real.

SEO, AEO Y GEO

Home
WebSite + Organization

Temas
CollectionPage + ItemList

Voces
CollectionPage + Person

CQST
AboutPage + Organization

Ciclo
CollectionPage

Artículo
Article + Person + Organization + BreadcrumbList + citation

Mantener canonical, sitemap, RSS, robots y enlaces internos claros.
Mientras el sitio siga en github.io, las páginas editoriales continúan con noindex.

ANTES DE PRODUCCIÓN

Conectar cadaquiensutema.com y HTTPS.
Quitar noindex solo en URLs públicas definitivas.
Cambiar imágenes Open Graph temporales de github.io al dominio real.
Eliminar data-stub.
Conectar formulario de suscripción.
Añadir Grift WOFF2 con licencia web.
Crear Website ID de Umami para Producción.
Revisar sitemap y feed.
Probar iPhone, Android, desktop, 320 CSS px, zoom 200%, teclado, Reduce Motion y Share.
