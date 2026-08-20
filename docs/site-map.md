# CQST · mapa del sitio

La arquitectura confirmada es más pequeña de lo que parece.
No inventamos secciones globales antes de diseñar la home.

## Confirmado

- Inicio `/`
- cada ciclo `/<ciclo>/`
- cada pieza `/<ciclo>/<slug>/`
- privacidad `/privacidad/`
- RSS `/feed.xml`
- sitemap `/sitemap.xml`

Ejemplo actual

- Empezar `/empezar/`
- La fecha la ponemos después `/empezar/la-fecha-la-ponemos-despues/`

## Todavía no se convierte en navegación global

No damos por hecho que CQST necesite botones llamados

- Artículos
- Archivo
- Ciclos
- About us
- Contacto

La home definirá qué accesos globales merecen existir.

## Menú dentro de un artículo

El drawer del artículo es LOCAL al ciclo.
No intenta ser el hamburger completo del sitio.

Debe ofrecer

1. logo de CQST que vuelve a Inicio
2. nombre del ciclo
3. las voces y piezas del ciclo
4. Ver Empezar
5. Compartir esta pieza

Eso mantiene orientación sin meter navegación global que no pertenece al acto de leer.

## Navegador al final del artículo

Es distinto al drawer.

Su trabajo es mover al lector hacia la siguiente voz sin sacarlo del ciclo. Muestra las tres piezas y un preview de la pieza seleccionada.

## Footer global

El footer no repite el ciclo.

Actualmente contiene

- marca
- volver arriba
- RSS
- Instagram
- TikTok
- Privacidad

Podrá evolucionar cuando exista la home, pero no debe convertirse en un cementerio de links.

## Voces

No lanzamos páginas de perfil individuales por defecto. Cada artículo incluye La voz con foto, bio breve y redes relevantes.

Si más adelante una persona acumula varias piezas, una URL de voz puede tener sentido como archivo editorial de sus textos.
