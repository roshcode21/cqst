# CQST · Home V4

## Idea rectora

La portada deja de funcionar como landing. Debe sentirse como una publicación desde el primer viewport.

La identidad y el contenido aparecen al mismo tiempo.

En móvil no existe un hero de 100svh. El contenido determina la altura y una pieza real del ciclo actual debe empezar a aparecer muy pronto.

## Navegación

Desktop

- símbolo CQST = Portada
- Ciclos
- Por dentro
- Proponer

Móvil

- Portada
- Ciclos
- Por dentro
- Proponer

La navegación es una pieza glass propia de CQST. Usa blur, saturación, borde lavanda, sombra corta y una capa cromática hard-light muy contenida. Cambia de superficie cuando cruza secciones oscuras.

Voces deja de ser navegación principal. Puede vivir como ruta secundaria desde autores, Por dentro y footer.

## 01 · Portada viva

Fondo blanco.

Desktop

- retícula 12 columnas
- kinetic ocupa aprox. 7 columnas
- ciclo actual ocupa aprox. 5 columnas
- contenido real visible desde el primer viewport

Móvil

- kinetic grande pero content-sized
- explicación breve
- ciclo actual inmediatamente debajo
- la primera pieza debe asomarse sin obligar a recorrer una pantalla vacía

Copy de entrada

> Cada ciclo de CQST parte de un tema compartido. Lo escriben personas distintas, cada una desde su propia relación con él, y las piezas se publican juntas para leerse en compañía.

Kinetic

- 9 masters reales
- loop continuo
- velocidad constante
- hover/focus pausa en desktop
- tap alterna pausa en touch
- Reduce Motion = estado estático

## 02 · En curso · Empezar

No es una segunda sección repetida. Vive dentro de la portada como índice editorial.

Cada entrada muestra

- título
- voz
- tiempo
- fragmento al hover en desktop
- fragmento visible en móvil
- estado leído mediante satélite verde discreto

Sin cards gigantes. Sin números. Sin cápsula LEÍDO.

## 03 · Siguiente ciclo · Dinero

Dinero entra desde ahora para probar crecimiento real.

Cuatro espacios deliberadamente provisionales

- [título de la pieza]
- [aquí entrará un fragmento cuando exista]
- voz por confirmar

No se inventa contenido del tema.

El ciclo siguiente no compite con el actual. Funciona como anticipo compacto.

## 04 · Por dentro

La home presenta suficiente contexto para entender CQST sin convertirse en About.

Copy base

> Hay temas que cambian por completo según quién los cuenta. CQST nació para reunir esas diferencias sin convertirlas en debate ni obligarlas a encajar. Cada ciclo propone un tema y deja que varias voces lo recorran a su manera. Después las piezas aparecen juntas, para que el lector encuentre también sus propios cruces.

### Cómo se forma un ciclo

> Alrededor de cada tema se van sumando personas con historias, oficios, preguntas y maneras de mirar que no tienen por qué coincidir. A cada una le proponemos el mismo punto de partida y después dejamos que encuentre su propia forma de entrar. Cuando las piezas llegan, la edición cuida el conjunto sin borrar las diferencias.

### Homo narrans

> Hay una expresión que se quedó cerca mientras imaginábamos CQST, Homo narrans. John D. Niles la usa para pensar al ser humano desde su impulso de contar y compartir relatos. Nos interesa porque una historia nunca llega sola. Trae memoria, lenguaje, contexto y la forma particular en que alguien decidió unir los hechos. Por eso un mismo tema puede abrir caminos tan distintos sin dejar de ser el mismo.

### El símbolo

Usar `/assets/brand/simbolo.png`.

> El símbolo nació de la misma intuición. Una cabeza de perfil, dos trayectorias que se cruzan y un destello arriba. Más que un código cerrado, nos recuerda ese momento en que algo ocupa la cabeza, vuelve, se mezcla con otras cosas y finalmente encuentra una forma de salir. Esa lectura puede cambiar también. Nos gusta que lo haga.

## 05 · Proponer un tema

Título

> Hay temas que empiezan antes de llegar a CQST.

Texto

> A veces aparecen en una conversación, en algo que no deja de molestarte, en una pregunta que vuelve o en una idea que todavía no sabes cómo nombrar. Si tienes una de ésas, cuéntanos. No hace falta convertirla en pitch. Queremos saber por qué sigue ahí.

Interacción

- textarea de una frase
- el texto que escribe la persona aparece grande y semitransparente detrás del módulo
- submit genera mailto a `hola@cadaquiensutema.com`
- asunto `Un tema para CQST`

CTA

> Ponerlo en circulación →

## 06 · Suscripción

Título

> El próximo ciclo te lo mandamos nosotros.

Texto

> Déjanos tu correo. Cuando haya un tema nuevo y las primeras voces estén listas, te mandamos la entrada al ciclo. Nada de inventar frecuencia para llenar la bandeja.

CTA

> Mándamelo →

Microcopy

> Un correo cuando haya ciclo nuevo.

En Lab no se almacena el correo. La interacción registra intención en Umami y muestra un estado claro de laboratorio. En producción se conecta a la herramienta elegida.

## 07 · Footer

- logo completo con tagline, monocromático
- Ciclos
- Por dentro
- Voces como acceso secundario
- Instagram
- TikTok
- Facebook
- `hola@cadaquiensutema.com`
- RSS
- Privacidad

## Color

- blanco = portada / entrada
- paper = lectura editorial y descansos
- night = profundidad conceptual
- azul = arquitectura / interacción principal
- verde = vivo / leído / confirmado
- naranja = audio / escucha
- amatista = contexto / lateralidad
- amarillo = foco excepcional

El neón se usa como verbo y estado, no como una habitación completa de forma predeterminada.

## Tipografía

- Grift = identidad, navegación, títulos, UI
- Newsreader = prosa, fragmentos y capas editoriales
- pixel de `tema` permanece dentro del sistema de logo

## Analítica Umami V4

Eventos sugeridos

- `Portada · abrió artículo`
- `Portada · abrió ciclo`
- `Portada · abrió Por dentro`
- `Portada · propuso tema`
- `Portada · intentó suscribirse`
- `Kinetic · pausó`
- `Kinetic · reanudó`

## Escalabilidad

Cuando Dinero sea el ciclo actual

- Dinero ocupa el índice principal de la portada
- Empezar baja a Ciclos anteriores
- la home no acumula ciclos completos

`/ciclos/` será el índice escalable. Cada ciclo ocupa una fila y despliega sus piezas cuando el usuario decide abrirlo.

No numerar ciclos como cronología editorial.