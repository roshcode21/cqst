# CQST · arquitectura de producción

Última revisión: 3 de septiembre de 2026

## Estado

V20 queda congelada como referencia visual del home. La rama `v21-production-refactor` reconstruye ese resultado como sistema de producción. El objetivo no es rediseñar el home, sino retirar deuda de laboratorio sin alterar la experiencia aprobada.

## Principios

1. El contenido editorial existe en HTML aunque JavaScript no cargue.
2. JavaScript mejora interacción; no es la fuente de verdad de artículos, ciclos ni voces.
3. Una pieza se define una vez y alimenta artículo, ciclo, voz, home, RSS, sitemap, datos estructurados y búsqueda.
4. Las URLs públicas son estables y legibles.
5. El home V20 es el golden master visual hasta completar la comparación de V21.
6. No se publican ciclos ficticios para llenar una interfaz.
7. No se arrastran clases o estilos con número de versión al código final.
8. Accesibilidad, SEO, AEO y GEO se resuelven desde estructura semántica y contenido real, no con capas de keywords artificiales.

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

## Refactor V21

Orden de trabajo

1. Separar contenido de presentación.
2. Crear tokens y estilos base compartidos.
3. Consolidar V20 en `home.css` sin cascada V11–V20.
4. Consolidar comportamiento en `home.js` sin parches CSS inyectados.
5. Renderizar el contenido visible directamente desde Eleventy.
6. Comparar V21 contra V20 en desktop, móvil y anchos intermedios.
7. Sólo después retirar código de laboratorio de la ruta de producción.

## Regla de oro

Si una limpieza cambia visualmente V20 sin que exista una razón funcional, semántica, accesible o de rendimiento aprobada, la limpieza es incorrecta.
