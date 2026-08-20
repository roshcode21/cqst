# CQST · SEO, AEO y GEO

Última revisión 20 de agosto de 2026

Esta guía evita trucos de temporada. La prioridad es que las personas disfruten CQST y que buscadores, motores de respuesta y agentes entiendan la misma estructura que ve una persona.

## Principio

Google considera que optimizar para sus experiencias generativas sigue siendo SEO. Para CQST eso significa contenido original, estructura técnica clara, URLs estables, buena experiencia de lectura y relaciones explícitas entre artículo, voz y ciclo.

No fragmentamos textos para perseguir consultas. No repetimos keywords de forma artificial. No creamos FAQs que el artículo no necesita.

## En cada artículo

El <head> debe incluir

- title único y breve
- meta description escrita para humanos
- canonical único
- Open Graph y Twitter Card
- imagen social 1200 x 630
- favicon estable
- RSS autodiscovery
- Article JSON-LD
- Person para la voz
- Organization para CQST
- BreadcrumbList
- fecha publicada y modificada
- ciclo
- fuentes como citation cuando existen
- AudioObject cuando exista una lectura en audio

El contenido visible debe incluir

- un solo H1
- autor
- fecha
- tiempo aproximado de lectura
- deck
- texto completo
- notas y fuentes cuando corresponda
- La voz
- enlaces internos hacia otras piezas del ciclo

## URLs

Formato

/ciclo/slug-del-articulo/

Ejemplo

/empezar/la-fecha-la-ponemos-despues/

El slug se decide antes del lanzamiento. Si cambia una URL ya publicada, la URL anterior debe redirigir a la nueva y la nueva conserva el canonical.

## Sitemap

/sitemap.xml contiene solo URLs canónicas que queremos indexar.

Actualizar lastmod cuando el contenido cambie de forma significativa.

## RSS

/feed.xml sirve para lectores, agregadores y descubrimiento de publicaciones nuevas. Añadir cada artículo cuando se publica.

## Robots

/robots.txt permite rastreo general y permite expresamente OAI-SearchBot.

OAI-SearchBot ayuda a que contenido público pueda descubrirse, resumirse y citarse en ChatGPT Search.

GPTBot es un control diferente relacionado con entrenamiento. No se toma una decisión especial sobre GPTBot en este archivo por ahora.

## llms.txt

No lo usamos como requisito de lanzamiento.

La guía de Google de 2026 dice expresamente que archivos de IA innecesarios como llms.txt no son una táctica necesaria para ganar visibilidad en sus experiencias generativas. OpenAI Search tampoco lo exige.

Podemos experimentar con uno más adelante si un producto concreto demuestra que lo consume y aporta valor. No lo tratamos como palanca SEO o GEO.

## Search Console

Al conectar cadaquiensutema.com

1. verificar el dominio en Google Search Console
2. enviar https://cadaquiensutema.com/sitemap.xml
3. revisar indexación y Core Web Vitals
4. revisar el informe de rendimiento de IA generativa cuando esté disponible para la propiedad

## Bing y Copilot

Después del dominio

1. registrar Bing Webmaster Tools
2. enviar sitemap.xml y feed.xml
3. evaluar IndexNow para avisar cuando una URL nueva se publica o una existente cambia

IndexNow complementa el sitemap. No lo sustituye.

## Umami

Umami responde qué hacen las personas después de llegar. Search Console y Bing Webmaster Tools responden cómo encuentran CQST.

No confundir las dos capas.

Eventos editoriales principales

- Lectura · empezó
- Voz · completada
- Ciclo · continuó
- Audio · empezó
- Audio · terminó
- Compartir · usó

## Lanzamiento del dominio

Antes de hacer público cadaquiensutema.com

- conectar CNAME y DNS
- activar HTTPS
- cambiar robots meta de noindex a index en páginas públicas
- cambiar URLs de imágenes Open Graph del host github.io al dominio real
- usar un Website ID de Umami exclusivo para producción
- añadir la home al sitemap
- revisar enlaces sin destino
- validar structured data
- validar sitemap.xml
- validar feed.xml
- probar previews en Messages, WhatsApp, LinkedIn y otras plataformas
- enviar sitemap a Search Console y Bing
