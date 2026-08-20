# CQST · mapa del sitio V3

## Navegación global

La arquitectura pública de CQST tiene cuatro entradas estables.

- Portada `/`
- Temas `/temas/`
- Voces `/voces/`
- CQST `/cqst/`

La navegación no cambia cuando cambia el ciclo actual.

## Contenido

Cada ciclo conserva su propia URL.

- Empezar `/empezar/`
- cada pieza `/<ciclo>/<slug>/`

Ejemplo actual

- `/empezar/la-fecha-la-ponemos-despues/`

## Temas

`/temas/` es la memoria por ciclos.

La portada solo pone en primer plano el ciclo actual. Cuando llegue Dinero, Empezar pasa a Temas sin desaparecer.

No numeramos los ciclos en la interfaz.
No añadimos filtros hasta que el volumen los haga útiles.

## Voces

`/voces/` permite recorrer CQST por personas.

Al lanzamiento funciona como índice de participantes y piezas. Si una voz acumula varias publicaciones, puede crecer más adelante hacia una URL propia sin cambiar la arquitectura global.

## CQST

`/cqst/` concentra la explicación editorial del proyecto.

Su entrada es `… ¿y quién pregunta?` y contiene

- cómo funcionan los ciclos
- cómo se eligen las voces
- Homo narrans
- el símbolo
- quién edita esta primera etapa
- contacto
- propuesta de temas

No usamos About us, Nosotros ni una página de Contacto separada.

## Rutas antiguas del laboratorio

- `/explorar/` redirige a `/temas/`
- `/revista/` redirige a `/cqst/`

No deben aparecer en sitemap ni navegación.

## Navegación por dispositivo

Desktop usa un dock flotante con Portada, Temas, Voces y CQST.
Mobile usa navegación inferior con los mismos cuatro destinos.

El shell cambia de superficie según el contenido por el que pasa. El artículo conserva su propia interfaz de lectura y no adopta este dock.

## Artículos

La plantilla de artículo queda independiente.

El drawer del artículo sigue siendo local al ciclo. Su trabajo es orientar dentro de la lectura y mover entre voces, no reproducir la navegación global completa.

## Infraestructura

- privacidad `/privacidad/`
- RSS `/feed.xml`
- sitemap `/sitemap.xml`
- robots `/robots.txt`

Estas utilidades viven fuera de la navegación primaria y aparecen donde aportan contexto, normalmente en footer.
