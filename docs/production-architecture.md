# CQST · arquitectura de producción

Última revisión: 3 de septiembre de 2026

## Estado

V20 queda congelada como referencia visual del home. La rama `v21-production-refactor` reconstruye ese resultado como sistema de producción. El objetivo no es rediseñar el home, sino retirar deuda de laboratorio sin alterar la experiencia aprobada.

V21 ya cuenta con Grift real como webfont, CI de build, comparación visual automatizada, preview aislada y una rama sincronizada con `main` y mergeable.

## Principios

1. El contenido editorial existe en HTML aunque JavaScript no cargue.
2. JavaScript mejora interacción; no es la fuente de verdad de artículos, ciclos ni voces.
3. Una pieza se define una vez y alimenta artículo, ciclo, voz, home, RSS, sitemap, datos estructurados y búsqueda.
4. Las URLs públicas son estables y legibles.
5. El home V20 es el golden master visual hasta completar la comparación de V21.
6. No se publican ciclos ficticios para llenar una interfaz.
7. No se arrastran clases o estilos con número de versión al código final.
8. Accesibilidad, SEO, AEO y GEO se resuelven desde estructura semántica y contenido real, no con capas de keywords artificiales.
9. Las diferencias producidas por servir la tipografía oficial Grift en todos los dispositivos se evalúan como dirección tipográfica real, no como motivo para volver a los fallbacks del laboratorio.

## Stack

- Eleventy 3.1.6 como generador estático.
- Nunjucks para layouts y componentes.
- Markdown o Nunjucks con front matter para contenido editorial.
- Pagefind 1.5.2 para búsqueda estática.
- Formspree para formularios del sitio.
- Umami para analítica de comportamiento.
- GitHub Pages mientras el proyecto está en laboratorio; `cadaquiensutema.com` como host público final.

El output continúa siendo HTML/CSS/JS estático. No se introduce React, SPA ni una capa de servidor innecesaria.

## Arquitectura pública

- `/` — portada
- `/temas/` — memoria de ciclos
- `/<ciclo>/` — portada de un ciclo
- `/<ciclo>/<pieza>/` — artículo
- `/voces/` — índice de voces
- `/voces/<persona>/` — perfil editorial
- `/cqst/` — proyecto editorial
- `/buscar/` — búsqueda
- `/privacidad/`
- `/feed.xml`
- `/sitemap.xml`
- `/robots.txt`

## Modelo editorial

### Ciclo

Campos mínimos

- slug
- title
- deck
- status
- dateStart
- visualTheme
- order

### Voz

Campos mínimos

- slug
- name
- shortName
- bio
- image opcional
- links opcionales

### Pieza

Campos mínimos

- slug
- title
- deck
- cycle
- author
- published
- modified
- readingTime
- subjects
- description
- image
- status

Estados editoriales sugeridos

- `draft`
- `scheduled`
- `published`

Sólo `published` entra en home público, ciclo público, RSS, sitemap y Pagefind.

## Home de producción

- `src/index.njk` — HTML semántico y server-rendered.
- `src/_data/` — fuente de verdad editorial y configuración global.
- `assets/css/production/base.css` — tokens, fundamentos y webfonts.
- `assets/css/production/home.css` — presentación completa del home sin cascada V11→V20.
- `assets/js/production/home.js` — dock, órbitas, chevrons, scroll/swipe, logotipo cinético, formularios AJAX y analytics. No genera contenido editorial ni inyecta CSS.

## Tipografía

Grift se sirve como WOFF2 en los pesos realmente utilizados por CQST: 400, 500, 600, 700, 800 y 900. Se retiraron del branch las copias TTF, WOFF, itálicas y pesos que el home no consume. Matrixel continúa como display pixel.

La webfont real es la referencia tipográfica de producción. Los fallbacks permanecen únicamente como degradación técnica.

## Formularios

Newsletter y Proponer un tema utilizan Formspree `moeqwono` mediante AJAX, con `action` y `method="POST"` presentes también en HTML como degradación funcional.

## Structured data

- Home — `WebSite` + `Organization`
- CQST — `AboutPage`
- Temas y ciclos — `CollectionPage` + `ItemList`
- Artículo — `Article` + `BreadcrumbList`
- Voz — `ProfilePage` + `Person`

Los datos estructurados deben describir contenido visible en la página.

## Búsqueda

Pagefind se ejecuta después de Eleventy sobre `_site`.

La UI será propia de CQST. No se adopta la interfaz visual genérica de Pagefind.

Filtros previstos cuando el volumen los justifique

- ciclo
- voz

La página `/buscar/` no sustituye navegación editorial. Es una herramienta de archivo.

## Migración progresiva

Eleventy genera el home nuevo. Las rutas existentes (`/cqst/`, `/empezar/`, artículo actual, `/temas/`, `/voces/`, `/privacidad/`, RSS, sitemap, robots y manifest) se conservan temporalmente mediante passthrough hasta que cada una sea reconstruida en `src/`.

Cuando una ruta tenga reemplazo Eleventy, se elimina únicamente su passthrough. No se hace un big-bang rewrite.

## QA V21

CI comprueba

- build Eleventy + Pagefind;
- existencia del home y de las rutas públicas actuales;
- contenido editorial server-rendered;
- ausencia de clases históricas V11–V20 en el home de producción;
- Formspree y JSON-LD presentes;
- capturas V20 vs V21 en 390, 430, 768, 1024, 1366 y 1920 px para portada, Leer × tema, etcétera, YQP y Participar.

La revisión con Grift real confirma que no hay una ruptura estructural del home. Las diferencias visibles son principalmente métricas tipográficas propias de dejar de depender del fallback y deben resolverse sólo si alteran jerarquía, legibilidad o composición, no para reproducir artificialmente la métrica de otra fuente.

La carpeta `preview/` existe únicamente para revisión visual de V21 antes del merge. No forma parte de la arquitectura pública final y debe retirarse al cerrar el refactor.

## Orden después de V21

1. `/empezar/` — portada de ciclo.
2. plantilla definitiva de artículo.
3. `/cqst/` — conocer el proyecto.
4. `/voces/` y perfiles individuales.
5. `/temas/` — memoria de ciclos.
6. `/buscar/` — Pagefind con interfaz CQST.
7. lanzamiento de dominio, redirects, indexación y observabilidad.

## Regla de oro

Si una limpieza cambia visualmente V20 sin que exista una razón funcional, semántica, accesible o de rendimiento aprobada, la limpieza es incorrecta. Grift oficial sí constituye una razón tipográfica válida; los ajustes posteriores se hacen alrededor de esa fuente, no sustituyéndola.
