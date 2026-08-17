# PaginaGuias

Sitio estático (HTML/CSS/JS puro, sin build step) con material de "aula invertida" para las 4 materias que dicta Roy Carrasco en la Facultad de Ingeniería de Sistemas de la UAB: POO, Base de Datos II, Ingeniería de Software y Teoría General de Sistemas.

- `index.html` — landing con las 4 materias y el grid de guías (tarjetas "disponible" vs "próximamente"). Al publicar una guía nueva, mover su tarjeta de "próximo" a "disponible" y agregar la siguiente como "próximo".
- `guias/`, `guias_bd/`, `guias_tgs/` — una página HTML autocontenida por guía.
- `assets/guia.css` — hoja de estilos compartida por todas las guías (sidebar, quizzes, modo oscuro, bloques `.code`).

## Patrón de una guía

Cada guía de `guias_bd/` (y las demás carpetas) sigue el mismo esqueleto: sidebar con buscador y nav por secciones, hero, secciones `<section class="container">` con `.card`, bloques `.highlight` para notas importantes, tablas `.tabla`, bloques `.code`/`.code-header` para SQL (sin resaltado de sintaxis, ni ejecución en vivo), y actividades interactivas (`quiz-mc`, `quiz-match`, `quiz-classify`, `quiz-fill`) autocorregibles con progreso guardado en `localStorage`. El motor de quizzes y el boilerplate de script (menú, tema, progreso) se copian tal cual de una guía existente — no se reinventan. Al final siempre hay Cheat Sheet + "¿Sabías que...?" + footer.

**Al redactar cualquier actividad de opción múltiple (`quiz-mc`, `quiz-fill`, `quiz-classify`): nunca dejar pistas involuntarias en la forma de la pregunta, y verificarlo con datos, no a ojo.** Dos patrones concretos, y cómo se auditan de verdad:
- **Extensión de las opciones**: si la correcta es sistemáticamente la más larga/detallada (o la más corta) mientras los distractores son escuetos, el estudiante puede acertar por longitud sin razonar el contenido. Medir **cantidad de caracteres real** de cada opción de una misma pregunta (no una impresión visual) — si la razón largo_máx/largo_mín pasa de ~1.6, achicar la correcta o desarrollar los distractores. Excepción legítima: opciones que son una sola palabra clave fija (Verdadero/Falso, SELECT/FROM/ON) — ahí no se fuerza relleno artificial.
- **Posición de la respuesta correcta**: no debe repetirse la misma posición pregunta tras pregunta, y en `quiz-classify` específicamente **cuidado con que la fila N tenga su correcta en la posición N** — ese patrón diagonal (fila 1→opción 1, fila 2→opción 2, fila 3→opción 3) es tan explotable como cualquier otro y es fácil de pasarlo por alto porque a simple vista "1, 2, 3" parece variado. La forma confiable de revisar esto en una guía ya escrita es un script que recorra el HTML y liste, por pregunta, la posición de `data-correct` y el largo en caracteres de cada opción — no alcanza con leer el archivo y estimar; ver commit de esta guía (`joins-subconsultas.html`) para un ejemplo del script.
`quiz-match` no tiene este problema porque el orden de la columna derecha ya se mezcla al azar por JS en cada carga.

Al crear una guía nueva, usar como plantilla la guía más reciente de esa carpeta (ver `guias_bd/ddl-postgresql.html` como ejemplo reciente).

## Formatos alternativos de guía (evaluar antes de crear una guía nueva)

El esqueleto lineal (sidebar + scroll por secciones) **no es la única forma posible**, pero para evaluar alternativas hay que separar **tres niveles independientes**, porque se confunden fácil (fue un error real en el roadmap de TGS #3, corregido más abajo):

1. **Estilo de página completa** — cómo se navega la guía *entera*: sidebar+scroll, slides, nodos, ramas, etc. Cambia la estructura/navegación de punta a punta.
2. **Estilo de sección** — cómo se narra *un tramo* de contenido dentro del formato de página ya elegido, sin cambiar la navegación general de la guía.
3. **Tipo de actividad** — un widget interactivo autocontenido que se inserta dentro de una sección (calificado o exploratorio). Es ortogonal a los dos niveles de arriba: la misma actividad funciona dentro de una página Lineal, un slide de PPT, o cualquier otro formato.

Elegir el nivel 3 (por ejemplo, agregar un sandbox interactivo a una sección) **no cambia** el nivel 1 — la guía sigue siendo Lineal si su navegación general sigue siendo sidebar+scroll. El motor de quizzes (`quiz-mc`, `quiz-match`, `quiz-classify`, `quiz-fill`) y la infraestructura (progreso en `localStorage`, tema oscuro) viven en el nivel 3 y son independientes del contenedor/navegación — se reutilizan igual en cualquier formato de página.

**Antes de crear una guía nueva, evaluar el tipo de contenido en los tres niveles y sugerirle a Roy la(s) mejor(es) opción(es), con Lineal + prosa normal + quiz-mc/match/classify/fill como default si ninguna alternativa aplica claramente mejor:**

### Nivel 1 — Estilo de página completa

| Formato | Cuándo conviene | Encaje típico |
|---|---|---|
| **Lineal (default actual)** | Contenido con orden natural, procedimental | POO, BD2 (la mayoría) |
| **Mapa conceptual navegable** (nodos = conceptos, clic expande tarjeta + quiz, líneas = relaciones) | Conceptos muy interrelacionados, sin orden fijo | TGS: `sistema.html`-style (elemento/límite/entorno) |
| **Narrativa ramificada / caso con decisiones** (el estudiante elige, ve consecuencias, distintas ramas llevan a distintos quizzes) | Diagnóstico, toma de decisiones, casos aplicados | TGS: estilo `diagnostico-vsm.html`, capstones |
| **Línea de tiempo interactiva** (la guía entera se recorre a lo largo de un eje temporal, en vez de sidebar+scroll) | Contenido con eje histórico/evolutivo real | TGS: origen y evolución de la teoría |
| **Presentación por diapositivas (PPT-style)** (deck slide-a-slide con flechas/teclado/swipe, admite imágenes/SVG, y diapositivas de actividad que embeben el motor de quizzes existente — motor de navegación y CSS en `assets/guia.css`, ver `ingenieria-de-sistemas.html` como plantilla) | Contenido expositivo con fuerte componente visual, pensado para proyectarse en clase; también sirve como resumen/repaso navegable fuera de clase | TGS #4: Ingeniería de Sistemas (piloto, publicado 2026-08-13) — cambia el formato de página de verdad, porque cambia toda la navegación/estilo visual |
| **Canvas zoom/pan estilo Prezi** | Narrativa "panorama → detalle → panorama" | Solo para un capstone puntual — alto costo de implementación (sin librería, en vanilla JS), riesgo de mobile/accesibilidad; no usar como default |
| **Scrollytelling con panel fijo** (`position: sticky` + `IntersectionObserver`: dos columnas, prosa que scrollea a la izquierda y un único artefacto visual a la derecha que se construye/resalta según la sección visible — técnica de periodismo de datos tipo Pudding.cool) — uso normal es página completa, pero también puede acotarse a una sola sección (ver Nivel 2) | Un mismo artefacto que crece o cambia de estado a medida que se explica toda la guía | ✅ Piloto: BD2, `guias_bd/joins-subconsultas.html` — página completa de verdad, sin sidebar (reemplazado por `.flow-topbar`: marca + progreso + menú + tema, mismo grado de compromiso que `.deck-*`). Motor reutilizable en `assets/guia.css` bajo `.flow-*` (chrome de página) + `.scrolly-dg-wrap`/`.scrolly-query`/`.scrolly-result-*` (contenido del panel, agnóstico del nivel). El tramo explicativo (JOINs, luego subconsultas) usa panel fijo de dos columnas; quizzes, Cheat Sheet y cierre pasan a una columna (`.flow-flat`) porque un widget interactivo o una tabla de referencia no se benefician de un panel sincronizado — igual que el deck no le da a cada slide un diagrama propio. **Iteración real de esta guía (16/08):** se armó tres veces antes de acertar el nivel — 1ª vez fue Nivel 3 (una actividad empaquetada dentro de una sección Lineal normal); 2ª vez fue Nivel 2 a medias (la sección cambiaba de estilo pero el sidebar y el hero de la guía seguían intactos); recién la 3ª es Nivel 1 real: toda la guía, desde el primer píxel, navega distinto. Ver la entrada de Nivel 2 más abajo, que quedó sin pilotar porque el pedido real siempre fue este |

### Nivel 2 — Estilo de sección

Cambia solo cómo se presenta un tramo de contenido; el resto de la guía sigue con su formato de página normal.

| Estilo de sección | Cuándo conviene | Encaje típico |
|---|---|---|
| **Explicación reactiva** (patrón "explorable explanations" de Bret Victor / Nicky Case: valores editables/arrastrables incrustados dentro de la propia oración, `<span class="reactivo">`, que recalculan el párrafo en vivo) | Conceptos donde mover un número y ver la consecuencia en la misma frase enseña más que un panel aparte (fórmulas, coeficientes, probabilidades) | Aún sin pilotar — candidatos: BD2 (cardinalidad/normalización con valores editables in situ), TGS (Ley de Variedad de Ashby) |
| **Scrollytelling acotado a una sección** (mismo mecanismo del Nivel 1, pero solo para el tramo de la guía donde un artefacto necesita construirse en vivo, sin tocar la navegación del resto) | Una sección puntual con un artefacto que crece paso a paso, dentro de una guía por lo demás Lineal | Aún sin pilotar — candidato: ISW (una sección donde la arquitectura evoluciona con cada decisión de diseño). **Ojo antes de construirlo** (lección del propio intento fallido en BD2, ver fila de arriba): que la sección *entera* narre a través del scroll — planteo del problema, mecanismo y conclusión — no solo un widget en el medio con párrafos normales antes y después; eso sería Nivel 3 (actividad empaquetada), no un cambio real de estilo de sección. Y aun logrando eso, confirmar con Roy si lo que pide es realmente Nivel 2 (solo esa sección cambia) o Nivel 1 (toda la guía) antes de construir — son decisiones fáciles de confundir |

### Nivel 3 — Tipo de actividad

Widget autocontenido dentro de una sección, no cambia nada de los dos niveles de arriba.

**Autocorregibles (calificadas, alimentan la barra de progreso en `localStorage`):**

| Actividad | Qué hace |
|---|---|
| `quiz-mc` | Opción múltiple |
| `quiz-match` | Emparejar pares |
| `quiz-classify` | Clasificar en categorías |
| `quiz-fill` | Completar espacios |
| `quiz-parsons` *(propuesto, sin implementar)* | Reordenar bloques de código desordenados en vez de escribirlos de cero — evidencia de investigación en educación de programación: aprendizaje equivalente a escribir desde cero pero en menos tiempo y con menor carga cognitiva. Encaje obvio en POO, como escalón entre "leer código" y "escribirlo de cero" |

**Exploratorias (sin calificar, no alimentan la barra de progreso — son para manipular y entender):**

| Actividad | Qué hace |
|---|---|
| **Simulación/sandbox interactivo** (sliders que alimentan un diagrama en vivo) | TGS #3, `dinamica-sistemas.html`: la página sigue siendo Lineal (sidebar+scroll) de punta a punta — lo que introdujo esa guía es este *tipo de actividad* dentro de sus secciones, no un formato de página nuevo. El roadmap de abajo ya está corregido para reflejar esto |

No migrar guías ya publicadas a un formato/estilo/actividad nuevo salvo pedido explícito. La idea es pilotar cosas nuevas en guías nuevas, no reescribir lo existente.

## Vincular una guía a ATENZA — guías nativas (16/08, reemplaza el modelo "sin nota" de 05/08)

Fusión con ATENZA: el docente vincula una guía a una `Clase` y le carga una nota + el manifest de sus `data-quiz-id` (referencia, automática/abierta, respuesta modelo si aplica) directo en el panel de ATENZA — nada de esto toca este repo. Desde ahí puede **lanzarla en vivo a la clase** (pantalla completa, incidencias si el estudiante sale, nota real que cuenta para el curso) o dejarla como práctica libre. Esto **no cambia en nada la autoría de la guía** — sigue siendo el mismo HTML autocontenido de siempre, y sigue siendo accesible en público sin ATENZA.

Para habilitarlo en una guía puntual: pegar el bloque `<!-- ATENZA · guía nativa en vivo -->` (ver `guias_bd/joins-subconsultas.html` o `guias_tgs/ingenieria-de-sistemas.html` como ejemplo, o el snippet documentado en `DEPLOY-GUIAS-SNIPPET.md` del repo de atenza) al final de la guía, justo después del `</script>` del motor de quizzes y antes del Cloudflare Web Analytics. El bloque no toca el motor de quizzes existente — se engancha una sola vez a `marcarResuelto()` (reporta cada pregunta resuelta, automática o abierta según la clase `quiz-open`) y a `actualizarProgreso()` (dispara `/finalizar` al llegar al 100%), y solo actúa si la guía se abrió con `?atenza_token=...&guia_intento=...` en la URL (lo agrega ATENZA al armar el link desde "Tomar la guía"; accedida directo, como siempre, el bloque no hace nada).

`ATENZA_API` ya apunta a la URL real del backend: `https://api-atenza.atenzabo.com`.

**⚠️ Vincular una guía en ATENZA (nota + manifest) NO agrega el script acá solo — son dos pasos independientes.** Si se lanza una guía en clase sin haber pegado antes este bloque en su página, el lanzamiento igual se crea y el estudiante igual puede "Tomar la guía", pero nada de lo que conteste se reporta — termina con nota 0. Antes de lanzar una guía nueva, confirmar que ya tiene el bloque acá.

**Guías vinculadas hoy:** `guias_bd/joins-subconsultas.html`, `guias_tgs/ingenieria-de-sistemas.html`, `guias_tgs/arquetipos-sistemicos.html`. (`guias_bd/dml.html` todavía tiene el bloque viejo de 05/08 — sin nota, sin pantalla completa — hay que reemplazarlo antes de lanzarla como guía nativa.)

**Bug corregido (2026-08-13):** hasta esta fecha `ATENZA_API` era un placeholder (`https://api.atenza.com`) y el flag de "reportado" se guardaba *antes* de confirmar éxito, así que cualquier estudiante que completara una guía vinculada en ese período quedó marcado como reportado en su navegador sin que el backend se enterara nunca.

**Bug corregido (2026-08-17):** `joins-subconsultas.html` se lanzó como guía nativa en ATENZA sin tener este bloque pegado nunca — cero respuestas ni pantalla completa, el estudiante terminó sin ninguna señal de que ya podía cerrar la pestaña, y el docente tuvo que cancelar el lanzamiento a mano, lo que calificó con nota 0/20 pese a haber contestado todo bien. Se agregó el bloque a esa página y, en ambas guías vinculadas, un aviso flotante visible al finalizar ("✅ ¡Guía enviada!" o "⚠️ no se pudo enviar, tocá para reintentar") — antes el `/finalizar` se mandaba a ciegas, sin mostrarle nada al estudiante.

## Talleres con SQL en vivo (BD II)

Para reforzar una guía teórica de BD II con una clase de práctica/laboratorio, el patrón es un **taller** (`guias_bd/taller-*.html`): mismo esqueleto de guía, pero los bloques `.code` estáticos se reemplazan por bloques `.editor-panel` editables y ejecutables (idéntica estructura HTML/CSS que usan las guías de POO con Pyodide), corriendo **PostgreSQL real compilado a WebAssembly** vía [PGlite](https://pglite.dev) (`@electric-sql/pglite`, cargado perezosamente desde jsDelivr — ver `guias_bd/taller-ddl.html` como plantilla). A diferencia de sql.js (que es SQLite, no Postgres), PGlite es el propio motor de Postgres, así que la sintaxis y los mensajes de error que ve el estudiante son exactamente los reales.

Detalles del patrón (ver `taller-ddl.html`): una única instancia de `PGlite` compartida por toda la página (para que los ejercicios se acumulen sobre la misma base de datos), un botón "🔄 Reiniciar base de datos" visible desde el inicio, y un bloque permanente de "zona de pruebas libres". Los resultados de `SELECT` se renderizan como tabla; el resto de sentencias muestra un mensaje de éxito con filas afectadas, o el error real de Postgres en rojo.

**Decisión (2026-08-05):** los `<textarea class="editor">` de los ejercicios guiados parten **vacíos** (con un `placeholder` corto tipo `-- Escribe aquí...`), no con el código ya resuelto. El enunciado de cada ejercicio va en prosa o en una lista dentro de un `.highlight` justo antes del `.editor-panel` (nombres de tabla/columna, tipos, restricciones, qué INSERT/UPDATE/DELETE hay que escribir), y el estudiante escribe el SQL de cero. Solo la "zona de pruebas libres" y el "Reto final" ya seguían este criterio; ahora aplica a todos los ejercicios numerados del taller.

**Cuidado al aplicar esto:** antes de vaciar los editores de un taller, verificar que **todo** el SQL que el enunciado va a pedir escribir ya fue enseñado en alguna guía teórica previa (no solo el tema principal del taller). En `taller-ddl.html` la teoría de DDL no cubre INSERT/UPDATE/DELETE (eso es DML, guía #2 del roadmap de BD II, todavía no publicada) pero el taller sí los necesita para cargar datos y provocar errores — se resolvió agregando una caja `.highlight` de "Sintaxis de referencia" con la forma genérica de esas tres instrucciones (sin resolver ningún ejercicio) antes del primer uso, en vez de crear o adelantar una guía completa de DML.

**Decisión (2026-08-05):** en los `.editor` de los talleres, copiar/cortar/pegar/soltar (drag&drop) está deshabilitado — el código se escribe a mano, no se trae de otro lado. Se bloquean los eventos `copy`/`cut`/`paste`/`drop` y, como capa extra, los atajos Ctrl/Cmd+C/V/X por `keydown`, con un aviso breve en un toast global (`#clipboardToast`) y un flash rojo (`.editor.bloqueado`) en el propio editor. Ver `conectarSqlLab()` y `mostrarAvisoPortapapeles()` en `taller-ddl.html` como referencia a copiar tal cual en los próximos talleres.

## Ejecución de Python en vivo (Pyodide) — Web Worker + input() real (POO)

Las 8 guías de POO con editor ejecutable (`variables.html`, `print.html`, `string.html`, `input.html`, `tipos-datos.html`, `condicionales.html`, `bucles.html`, `taller-repaso.html`) corren Pyodide en un **Web Worker**, no en el hilo principal. Esto es la 2ª iteración de la protección contra bucles infinitos:

- **1ª iteración (2026-08-13, ya superada):** `exec()` corría síncrono en el hilo principal con un watchdog `sys.settrace` que cortaba a los 8s. Acotaba el cuelgue pero no lo eliminaba — la pestaña seguía congelándose hasta 8s de verdad, y eso seguía siendo molesto para el estudiante.
- **2ª iteración (2026-08-14, actual):** Pyodide corre en un Worker aparte (`crearWorkerPyodide()` / `__codigoWorkerPyodide()`, cargado vía `Blob` + `importScripts`, no un archivo `.js` separado — la guía sigue siendo un HTML autocontenido). El hilo principal **nunca se bloquea**, pase lo que pase en el código del estudiante:
  - Botón **"⏹ Detener"** (inyectado por JS dentro de `conectarEditor()`, no hay que tocar el HTML estático de cada ejercicio) hace `worker.terminate()` al instante — corte real, no un timeout.
  - Si el estudiante no lo hace, `ejecutarPython()` tiene su propio timeout de 20s en el hilo principal que termina y recrea el worker solo.
  - El watchdog `sys.settrace` (8s) se mantiene *dentro* del worker como segunda capa — ya no es la única defensa, es redundancia barata.
  - Terminar el worker no pierde nada de estado porque cada ejecución ya corría con un dict de globals nuevo (`exec(..., {})`) — no hay contexto compartido entre ejecuciones que se pueda perder.

**`input()` real dentro del Worker — el problema y la solución:** un Worker no tiene `window.prompt`, y no se puede "esperar" una respuesta async en medio de un `exec()` síncrono sin bloquear el hilo de verdad. Se resolvió con el patrón estándar (el mismo que usa JupyterLite): **`SharedArrayBuffer` + `Atomics.wait`/`Atomics.notify`**. Cuando el código del estudiante llama `input()`, el worker escribe en un buffer compartido, hace `Atomics.wait` (bloqueo real del hilo del *worker*, no de la página), el hilo principal muestra el `prompt()` nativo, escribe la respuesta en el buffer y hace `Atomics.notify` — el worker se despierta con la respuesta. El timeout de 20s del hilo principal se cancela y se reprograma alrededor de cada `input-request`, para no confundir "el estudiante está pensando qué escribir" con "el código está colgado".

**Esto requiere aislamiento cross-origin** (`SharedArrayBuffer` no existe sin él): el archivo `_headers` en la raíz del repo aplica `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp`, **acotado a `/guias/*`** a propósito — `guias_bd/` (PGlite) y `guias_tgs/` no lo necesitan, y ampliarlo sin necesidad solo suma riesgo. Ese riesgo real: con `COEP: require-corp` activo, todo recurso cross-origin que cargue esa página necesita cooperar (CORP/CORS) o el navegador lo bloquea en silencio — esto incluye los ~decenas de archivos que `loadPyodide()` trae de jsDelivr y el beacon de Cloudflare Web Analytics al final de cada guía. **Todavía no se probó en un navegador real desplegado** que ninguno de esos recursos se rompa bajo aislamiento cross-origin — es la primera verificación a hacer después de deployar este cambio.

**Fallback si `SharedArrayBuffer` no está disponible** (headers no propagados aún, navegador viejo, o algo se rompió): `__crearSabInput()` detecta la ausencia y pasa `sab: null` al worker; `inputSincrono()` ahí lanza un `Error` claro ("input() no está disponible…") en vez de colgarse — el resto de la guía (todo lo que no usa `input()`) sigue funcionando igual, con Worker y botón Detener funcionando sin ningún cambio.

Ver `guias/variables.html` como plantilla a copiar tal cual (todo el bloque desde `/* ===== Pyodide en un Web Worker ===== */` hasta el cierre de `ejecutarPython()`, más el botón Detener dentro de `conectarEditor()`) en guías nuevas con Pyodide (`funciones.html`, `clases-objetos.html`). El estilo `.code-btn.stop` vive en `assets/guia.css`, no hace falta repetirlo por guía.

## Roadmap curricular: Base de Datos II (2026)

## Roadmap curricular: POO (2026)

**Decisión (2026-07-30):** antes de "Clases y objetos" hace falta un puente de fundamentos de Python que hoy no existe como guía propia (condicionales/bucles solo aparecen de forma incidental en ejemplos de guías previas, nunca como tema enseñado). Se optó por la **Opción B**: condicionales → bucles → funciones → clases y objetos, para que "método" se presente como "una función que ya conocés, pero adentro de una clase".

| # | Guía | Estado |
|---|---|---|
| — | Variables en Python (`variables.html`) | ✅ Publicada |
| — | print() en Python (`print.html`) | ✅ Publicada |
| — | String en Python (`string.html`) | ✅ Publicada |
| — | input() en Python (`input.html`) | ✅ Publicada |
| — | Tipos de Datos en Python (`tipos-datos.html`) | ✅ Publicada |
| 1 | Condicionales: if/elif/else y operadores lógicos (`condicionales.html`) | ✅ Publicada (2026-07-30) |
| 2 | Bucles: while y for (range, break/continue) (`bucles.html`) | ✅ Publicada (2026-08-10) |
| 2-taller | Taller de repaso integrador: variables → bucles, con problemas adaptados del banco de la Competencia de Programación UAB (`taller-repaso.html`) | ✅ Publicada (2026-08-12) |
| 3 | Funciones: def, parámetros, return y scope (`funciones.html`) | ⏭️ **Siguiente a crear** |
| 4 | Clases y objetos desde cero (`clases-objetos.html`) | Pendiente |

**Nota sobre `taller-repaso.html`:** a diferencia de los talleres de BD II (que usan PGlite/SQL), este reutiliza el mismo motor de Pyodide ya presente en las guías de POO. Todos sus ejercicios parten con el editor vacío (mismo criterio que los talleres de BD II) y el enunciado en un `.highlight` antes del panel. No usa el motor de quizzes (`quiz-mc`/etc.) porque ninguna guía de POO lo usa — el repaso es 100% código en vivo. Los ejercicios de listas se limitan a `for elemento in lista` (sin indexado ni métodos como `.append()`), porque eso todavía no se enseñó en ninguna guía de POO.

**Al completar una guía:** marcar su fila como "✅ Publicada" con la fecha, actualizar la tarjeta correspondiente en `index.html` (de "próximo" a "disponible", y agregar la siguiente como "próximo"), y avanzar la fila "⏭️ Siguiente a crear" a la guía que sigue en la tabla.

## Roadmap curricular: Teoría General de Sistemas (2026)

**Contexto:** a diferencia de POO y BD2, TGS no tiene una cadencia fija predefinida — las guías nuevas surgen del avance real de la materia. El bloque de cibernética avanzada (Ley de Variedad + VSM) cerró con 8 grupos exponiendo temas de profundización del VSM (recursividad, atenuación/amplificación de variedad, homeostasis/ultraestabilidad, autopoiesis, cibernética de 1er/2do orden, variedad en ciberseguridad, diagnóstico organizacional práctico), lo que motivó crear un capstone que consolida esos temas en vez de repetirlos como guías sueltas.

| # | Guía | Estado |
|---|---|---|
| — | Fundamentos y Origen de la TGS (`fundamentos-origen.html`) | ✅ Publicada |
| — | Introducción a la Teoría General de Sistemas (`sistema.html`) | ✅ Publicada |
| — | Modelado de Sistemas: Diagramas Causales (`modelado-sistemas.html`) | ✅ Publicada |
| — | TGS Aplicada: Sistemas de Información (`sistemas-informacion.html`) | ✅ Publicada |
| — | Cibernética Avanzada: Variedad y Viabilidad (`viabilidad-sistemas.html`) | ✅ Publicada |
| 1 | Diagnóstico y Rediseño Organizacional con el VSM — recursividad, atenuación/amplificación de variedad, homeostasis/ultraestabilidad, autopoiesis, cibernética de 1er/2do orden, variedad en ciberseguridad, caso práctico integrador (`diagnostico-vsm.html`) | ✅ Publicada (2026-08-04) |
| 2 | Metodologías de Sistemas: Duros y Blandos — distinción de Checkland, origen del SSM, rich pictures, definiciones raíz y CATWOE, modelos conceptuales, cambios factibles/deseables, caso práctico aplicado (`sistemas-duros-blandos.html`) | ✅ Publicada (2026-08-10) |
| 3 | Dinámica de Sistemas: Simulación de Stocks y Flujos — página sigue siendo Lineal (sidebar+scroll); piloto del **tipo de actividad** "Simulación/sandbox interactivo" (ver tabla de formatos arriba, Nivel 3): stock y flujo cuantificados, retraso y oscilación, bucle cerrado y efecto látigo reproducible con sliders (`dinamica-sistemas.html`) | ✅ Publicada (2026-08-11) |
| 4 | Ingeniería de Sistemas: de la Teoría a la Práctica — piloto del formato **Presentación por diapositivas (PPT-style)**: origen de la disciplina (Bell Labs, Apolo, INCOSE), el ciclo de vida en V, ingeniería de requisitos reutilizando CATWOE del SSM, arquitectura y estudio de trade-offs, verificación vs. validación, caso práctico (Biblioteca UAB) (`ingenieria-de-sistemas.html`) | ✅ Publicada (2026-08-13) |
| 5 | Arquetipos Sistémicos — Límites del crecimiento, Desplazar la carga, Escalada, Tragedia de los comunes, Éxito para quien tiene éxito, entre otros; se construye directo sobre los diagramas causales y stocks/flujos de la guía #3. Formato: **Presentación por diapositivas (PPT-style)**, reutilizando el motor de `ingenieria-de-sistemas.html` (no un formato nuevo — TGS #4 ya lo estrenó) (`arquetipos-sistemicos.html`) | ✅ Publicada (2026-08-17) |

**Al completar una guía:** marcar su fila como "✅ Publicada" con la fecha, actualizar la tarjeta correspondiente en `index.html` (agregarla como "disponible"), y agregar la siguiente fila cuando se defina el próximo tema según el avance real de la materia.

## Roadmap curricular: Base de Datos II (2026)

**Contexto:** clases 2x/semana hasta la última semana de octubre de 2026. Objetivo: que los estudiantes terminen expertos en SQL relacional y con nivel básico/intermedio en NoSQL (MongoDB). Cadencia acordada: **1 guía nueva por semana** (clase de teoría/aula invertida) + **1 clase de práctica/laboratorio** esa misma semana sobre la misma guía (sin guía nueva ese día).

| # | Guía | Estado |
|---|---|---|
| — | Modelado Entidad-Relación (`modelado-er.html`) | ✅ Publicada |
| — | Modelado relacional y normalización (`normalizacion.html`) | ✅ Publicada |
| 1 | DDL y restricciones en PostgreSQL (`ddl-postgresql.html`) | ✅ Publicada (2026-07-23) |
| 1-taller | Taller de laboratorio de DDL con SQL en vivo (`taller-ddl.html`) | ✅ Publicada (2026-08-05) |
| 2 | DML (INSERT/UPDATE/DELETE) + SELECT básico (WHERE/ORDER BY/LIMIT) (`dml.html`) | ✅ Publicada (2026-08-05) |
| 2-taller | Taller de laboratorio de DML y SELECT básico con SQL en vivo (`taller-dml.html`) | ✅ Publicada (2026-08-11) |
| 3 | JOINs (todos los tipos) + Subconsultas — piloto del formato **Scrollytelling con panel fijo** (Nivel 1 completo, ver tabla de formatos arriba): sin sidebar, panel fijo de dos columnas para el tramo explicativo (`joins-subconsultas.html`) | ✅ Publicada (2026-08-16) |
| 4 | Agregación (GROUP BY/HAVING) + Vistas | ⏭️ **Siguiente a crear** |
| 5 | Funciones de ventana + Índices y EXPLAIN | Pendiente |
| 6 | Transacciones: ACID, aislamiento, concurrencia y bloqueos | Pendiente |
| 7 | Procedimientos almacenados/funciones + Triggers | Pendiente |
| 8 | Seguridad (roles, GRANT/REVOKE) + cierre del bloque SQL | Pendiente |
| 9 | Introducción a NoSQL (documentos vs relacional) + CRUD básico en MongoDB | Pendiente |
| 10 | Modelado en Mongo (embedding vs referencing) + operadores de consulta | Pendiente |
| 11 | Aggregation framework ($match/$group/$project) + $lookup | Pendiente |
| 12 | Índices en Mongo + nociones de replicación/sharding | Pendiente |
| 13 | **Proyecto integrador final** | Pendiente |

**Proyecto integrador (semana 13):** no es una comparación en paralelo SQL vs Mongo — es un **sistema único con persistencia poliglota**: los datos transaccionales/estructurados (pedidos, pagos, inventario, usuarios) viven en PostgreSQL, y los datos flexibles o de alto volumen (catálogo con atributos variables, logs, comentarios/reseñas, carritos de sesión) viven en MongoDB, y ambos motores se usan juntos desde una misma aplicación. El objetivo es que decidan *qué dato va en cuál motor y por qué*, no solo que sepan usar los dos por separado.

**Al completar una guía:** marcar su fila como "✅ Publicada" con la fecha, actualizar la tarjeta correspondiente en `index.html` (de "próximo" a "disponible", y agregar la siguiente como "próximo"), y avanzar la fila "⏭️ Siguiente a crear" a la guía que sigue en la tabla.
