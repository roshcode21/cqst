# CQST · guía rápida de Umami

Este archivo existe para que cualquier persona del equipo pueda entender los eventos sin saber analítica.

## Los eventos que importan

| Evento en Umami | Qué significa | Para qué sirve |
| --- | --- | --- |
| Lectura · empezó | La persona entró de verdad al texto | Saber cuánta gente pasa de abrir la página a empezar a leer |
| Voz · completada | Terminó esa voz por lectura o audio | Nuestra métrica principal de consumo |
| Ciclo · abrió índice | Abrió el menú del ciclo dentro del artículo | Saber si necesita orientación o quiere explorar las otras voces |
| Ciclo · eligió voz | En touch seleccionó otra voz para verla | Entender qué voz despierta interés |
| Ciclo · continuó | Fue a leer o escuchar otra voz | Nuestra métrica principal de continuidad |
| Ciclo · abrió página | Fue al índice completo del ciclo | Medir exploración del ciclo |
| Notas · abrió una nota | Abrió una nota contextual | Saber qué ideas despiertan curiosidad |
| Notas · abrió fuentes | Abrió el bloque completo de notas | Medir intención de profundizar |
| Audio · empezó | Inició el audio | Medir adopción del formato audio |
| Audio · progreso | Llegó a 25, 50 o 75 por ciento | Ver cuánto dura la escucha |
| Audio · terminó | Terminó el audio | Compleción de escucha |
| Audio · cambió velocidad | Cambió la velocidad | Señal secundaria de uso real del reproductor |
| Compartir · usó | Abrió share nativo o copió el link | Medir intención de compartir |
| Lab · enlace de plantilla | Tocó un link que todavía es placeholder | Solo sirve durante desarrollo |

## Propiedades útiles

Los eventos pueden llevar datos adicionales. Umami los muestra dentro de Event data.

- articulo identifica la pieza
- ciclo identifica el ciclo
- modo distingue lectura de audio
- voz identifica la siguiente persona
- nota muestra el nombre de la nota
- porcentaje muestra 25, 50 o 75 en Audio · progreso
- metodo distingue compartir nativo de copiar link

## Qué mirar de verdad

No hace falta vigilar todos los eventos cada día. Para CQST las preguntas importantes son estas.

1. Cuánta gente empieza a leer
2. Cuánta gente termina una voz
3. Cuánta gente continúa con otra voz
4. Cuánta gente usa audio
5. Cuánta gente comparte

## Board recomendado

En Umami crea un Board de tipo Website llamado `CQST Editorial`.

Añade estas piezas.

- Metrics bar con visitantes, views y tiempo
- Events chart con Lectura · empezó y Voz · completada
- Funnel con Lectura · empezó → Voz · completada → Ciclo · continuó
- Event metrics para Audio · empezó y Audio · terminó
- Event metrics para Compartir · usó
- Metrics table por path para comparar artículos

Los eventos antiguos con nombres como `article_start` o `cycle_preview` no desaparecen del histórico del Lab. Los eventos nuevos ya se guardan con nombres legibles. Producción tendrá un Website ID separado y empezará limpia.
