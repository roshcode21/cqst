# CQST · Home V5

## Idea rectora

La home no es una landing ni un archivo de artículos. Funciona como portada viva de una publicación por ciclos.

Marca y contenido deben aparecer al mismo tiempo. El kinetic no ocupa un hero vacío. El ciclo activo comparte el primer escenario con la marca.

## Primer viewport

Desktop
- kinetic en el lado de marca
- frase breve de entrada
- Empezar y sus tres piezas en paralelo
- navegación glass flotante

Móvil
- kinetic sin forzar 100svh
- frase breve
- Empezar entra inmediatamente después
- las piezas son verticales y muestran fragmento de forma nativa
- navegación glass inferior

## Navegación

Visible en V5
- símbolo = inicio
- Ciclos
- Por dentro
- Proponer

Voces no ocupa navegación primaria. Sigue siendo una ruta secundaria accesible desde autores y footer.

El shell glass cambia de superficie según el fondo que atraviesa.

## Kinetic

Nueve masters existentes.
Velocidad constante.
Loop continuo.
Hover o focus pausa temporalmente.
Tap/click fija o libera la pausa.
Reduce Motion muestra el master estático.
Data Saver evita cargar el resto de frames.

## Empezar

Es el ciclo protagonista actual.
No usa cards gigantes.
Se representa como índice editorial de tres piezas.

Desktop
- cada fila puede expandir su fragmento al hover

Móvil
- fragmento visible siempre
- orden fijo: voz, título, fragmento, tiempo

El estado leído usa un pequeño satélite verde, no una etiqueta LEÍDO.

## Dinero

Existe desde ahora como segundo ciclo con cuatro espacios editoriales.
No se inventan títulos, autores o textos del tema.

Visualmente se representa mediante cuatro láminas glass superpuestas.
En desktop se abren en abanico al interactuar.
En móvil se convierten en un rail horizontal con scroll snap.

Cuando existan piezas reales, las mismas láminas pueden adoptar contenido sin cambiar la arquitectura.

## Crecimiento

La portada solo da escenario principal al ciclo activo.
La memoria completa vive en Ciclos.
No se apilan cinco secciones gigantes cuando haya cinco ciclos.

## Por dentro

Agrupa la explicación editorial, Homo narrans y el símbolo.
No se trata como About us.

La escritura debe ser cálida, editorial y clara. Evitar lenguaje de plataforma, corporate deck y fórmulas de copy genéricas.

No usar
- trabajar como verbo para describir el proyecto
- múltiples perspectivas
- dar voz
- poner en circulación como muletilla
- en curso
- próximamente
- siguiente ciclo como etiqueta de sistema
- numeración de ciclos

## Símbolo

Usar assets/brand/simbolo.png.
El favicon no lo sustituye.

Debe integrarse al espacio y no aparecer como sticker cuadrado.
En V5 vive dentro de una composición orbital con halo propio.

## Proponer

El usuario escribe una idea.
Su propio texto aparece como eco tipográfico de fondo.
El submit genera un mailto a hola@cadaquiensutema.com con asunto y cuerpo precargados.

Más adelante puede conectarse a Formspree u otro servicio sin cambiar la experiencia.

## Newsletter

El bloque debe sentirse como una pieza de identidad, no como formulario genérico.
Utiliza glass + espectro refractado inspirado en la identidad CQST.

En laboratorio no almacena correos.
En producción debe conectarse a un proveedor y mostrar consentimiento/privacidad según el flujo elegido.

## Color

Azul = marca y navegación
Verde = leído, confirmado, vivo
Naranja = escucha/audio
Amatista = contexto/desvío
Amarillo = foco/excepción
Paper = soporte editorial
Blanco = entrada, claridad y contraste
Night = profundidad conceptual

Los neones funcionan como señales y comportamiento. No cada uno como una sección completa.

## Tipografía

Grift
- identidad
- navegación
- títulos
- UI
- nombres

Newsreader
- fragmentos
- prosa editorial
- Homo narrans
- textos explicativos

El artículo V1 no se modifica por V5.

## Progressive enhancement

Baseline
- HTML completo y rastreable
- CSS usable sin JS
- navegación por anchors

Enhancement
- backdrop-filter
- kinetic
- IntersectionObserver para tono del shell
- scroll-driven animations donde exista soporte
- View Transitions heredadas desde base.css

Reduce Motion siempre tiene prioridad.

## Umami V5

Eventos
- Portada V5 · abrió artículo
- Portada V5 · abrió ciclo
- Portada V5 · pausó kinetic
- Portada V5 · reanudó kinetic
- Portada V5 · navegó a ciclos
- Portada V5 · navegó a Por dentro
- Portada V5 · navegó a Proponer
- Portada V5 · empezó propuesta de tema
- Portada V5 · propuso tema
- Portada V5 · enfocó suscripción
- Portada V5 · intentó suscribirse

Usar propiedades solo cuando aportan contexto real, como ciclo, voz o dispositivo.

## SEO / AEO / GEO

V5 sigue con noindex porque es laboratorio.
La home final en producción debe incluir WebSite + Organization y enlaces internos canónicos a Ciclos, Por dentro y contenido real.

El contenido esencial debe existir en HTML y no depender de JS.
No crear copy oculto para buscadores o agentes.
La explicación editorial visible debe ser la misma que una máquina pueda interpretar.
