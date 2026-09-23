# PaginaGuias

Sitio estático (HTML/CSS/JS puro, sin build step) con material de "aula invertida" para las 4 materias que dicta Roy Carrasco en la Facultad de Ingeniería de Sistemas de la UAB: POO, Base de Datos II, Ingeniería de Software y Teoría General de Sistemas.

- `index.html` — landing con las 4 materias y el grid de guías (tarjetas "disponible" vs "próximamente"). Al publicar una guía nueva, mover su tarjeta de "próximo" a "disponible" y agregar la siguiente como "próximo".
- `guias/`, `guias_bd/`, `guias_tgs/` — una página HTML autocontenida por guía.
- `guias_po/` — ruta de **Product Owner** para el Club de Programación (no es una de las 4 materias, ver "Roadmap: Club — Product Owner" al final). **No se lista en `index.html`**: solo se accede por link directo, igual que `examenes/`.
- `guias_ds/` — ruta de **Diseñador de Sistemas** para el Club de Programación (misma lógica que `guias_po/`, ver "Roadmap: Club — Diseñador de Sistemas" al final). **No se lista en `index.html`**: solo link directo.
- `assets/guia.css` — hoja de estilos compartida por todas las guías (sidebar, quizzes, modo oscuro, bloques `.code`).
- `HISTORIAL.md` — narrativa completa de bugs encontrados/corregidos, iteraciones y auditorías ya cerradas. Este archivo (`CLAUDE.md`) tiene las reglas y hechos vigentes; cuando hace falta el detalle de cómo se llegó a una decisión o cómo se corrigió un bug ya cerrado, `HISTORIAL.md#ancla` tiene la historia completa. Al auditar o editar una guía, conviene revisar el historial si el nombre del archivo aparece ahí — evita repetir un bug ya resuelto o deshacer una decisión ya tomada con Roy.

## Patrón de una guía

Cada guía de `guias_bd/` (y las demás carpetas) sigue el mismo esqueleto: sidebar con buscador y nav por secciones, hero, secciones `<section class="container">` con `.card`, bloques `.highlight` para notas importantes, tablas `.tabla`, bloques `.code`/`.code-header` para SQL (sin resaltado de sintaxis, ni ejecución en vivo), y actividades interactivas (`quiz-mc`, `quiz-match`, `quiz-classify`, `quiz-fill`) autocorregibles con progreso guardado en `localStorage`. El motor de quizzes y el boilerplate de script (menú, tema, progreso) se copian tal cual de una guía existente — no se reinventan. Al final siempre hay Cheat Sheet + "¿Sabías que...?" + footer.

**Al redactar cualquier actividad de opción múltiple (`quiz-mc`, `quiz-fill`, `quiz-classify`): nunca dejar pistas involuntarias en la forma de la pregunta, y verificarlo con datos, no a ojo.** Dos patrones concretos, y cómo se auditan de verdad:
- **Extensión de las opciones**: si la correcta es sistemáticamente la más larga/detallada (o la más corta) mientras los distractores son escuetos, el estudiante puede acertar por longitud sin razonar el contenido. Medir **cantidad de caracteres real** de cada opción de una misma pregunta (no una impresión visual) — si la razón largo_máx/largo_mín pasa de ~1.6, achicar la correcta o desarrollar los distractores. Excepción legítima: opciones que son una sola palabra clave fija (Verdadero/Falso, SELECT/FROM/ON) — ahí no se fuerza relleno artificial.
- **Posición de la respuesta correcta**: no debe repetirse la misma posición pregunta tras pregunta, y en `quiz-classify` específicamente **cuidado con que la fila N tenga su correcta en la posición N** — ese patrón diagonal (fila 1→opción 1, fila 2→opción 2, fila 3→opción 3) es tan explotable como cualquier otro y es fácil de pasarlo por alto porque a simple vista "1, 2, 3" parece variado. La forma confiable de revisar esto en una guía ya escrita es un script que recorra el HTML y liste, por pregunta, la posición de `data-correct` y el largo en caracteres de cada opción — no alcanza con leer el archivo y estimar; ver commit de `joins-subconsultas.html` para un ejemplo del script.
`quiz-match` no tiene este problema porque el orden de la columna derecha ya se mezcla al azar por JS en cada carga.

Al crear una guía nueva, usar como plantilla la guía más reciente de esa carpeta (ver `guias_bd/ddl-postgresql.html` como ejemplo reciente).

## Formatos alternativos de guía (evaluar antes de crear una guía nueva)

El esqueleto lineal (sidebar + scroll por secciones) **no es la única forma posible**, pero para evaluar alternativas hay que separar **tres niveles independientes**, porque se confunden fácil:

1. **Estilo de página completa** — cómo se navega la guía *entera*: sidebar+scroll, slides, nodos, ramas, etc. Cambia la estructura/navegación de punta a punta.
2. **Estilo de sección** — cómo se narra *un tramo* de contenido dentro del formato de página ya elegido, sin cambiar la navegación general de la guía.
3. **Tipo de actividad** — un widget interactivo autocontenido que se inserta dentro de una sección (calificado o exploratorio). Es ortogonal a los dos niveles de arriba: la misma actividad funciona dentro de una página Lineal, un slide de PPT, o cualquier otro formato.

Elegir el nivel 3 (por ejemplo, agregar un sandbox interactivo a una sección) **no cambia** el nivel 1 — la guía sigue siendo Lineal si su navegación general sigue siendo sidebar+scroll. El motor de quizzes (`quiz-mc`, `quiz-match`, `quiz-classify`, `quiz-fill`) y la infraestructura (progreso en `localStorage`, tema oscuro) viven en el nivel 3 y son independientes del contenedor/navegación — se reutilizan igual en cualquier formato de página.

**Antes de crear una guía nueva, evaluar el tipo de contenido en los tres niveles y sugerirle a Roy la(s) mejor(es) opción(es), con Lineal + prosa normal + quiz-mc/match/classify/fill como default si ninguna alternativa aplica claramente mejor:**

### Nivel 1 — Estilo de página completa

| Formato | Cuándo conviene | Guías que lo usan / motor |
|---|---|---|
| **Lineal (default actual)** | Contenido con orden natural, procedimental | POO, BD2 (la mayoría) |
| **Mapa conceptual navegable** (nodos = conceptos, clic abre panel con teoría+editor/quiz, líneas = orden sugerido) | Conceptos muy interrelacionados, sin orden fijo, o con orden sugerido sin forzar scroll lineal | POO: `clases-objetos.html` (7 nodos), `clase-objeto-analogias.html` (6 nodos). Chrome `.mapa-*`/`.mapa-ruta-grid` en `guia.css`. Detalle: [HISTORIAL.md#mapa-conceptual](HISTORIAL.md#mapa-conceptual) |
| **Narrativa ramificada / caso con decisiones** (el estudiante elige, ve la consecuencia — incluida la de un camino equivocado, sin penalidad — y solo la opción correcta desbloquea el siguiente tramo) | Diagnóstico, toma de decisiones, casos aplicados | TGS: `problema-proyecto-grado.html` (primer piloto real). Toda la ruta Club PO/DS usa este formato. Tipo de actividad: `quiz-decision` (ver Nivel 3). Detalle: [HISTORIAL.md#narrativa-ramificada](HISTORIAL.md#narrativa-ramificada) |
| **Línea de tiempo interactiva** (la guía entera se recorre a lo largo de un eje temporal) | Contenido con eje histórico/evolutivo real | Sin pilotar — candidato: TGS, origen y evolución de la teoría |
| **Presentación por diapositivas (PPT-style)** (deck slide-a-slide con flechas/teclado/swipe, admite imágenes/SVG, diapositivas de actividad embeben el motor de quizzes) | Contenido expositivo con fuerte componente visual, para proyectarse en clase o repasar fuera de ella | TGS: `ingenieria-de-sistemas.html` (piloto, plantilla), `arquetipos-sistemicos.html`, `clasificacion-sistemas.html`. Detalle: [HISTORIAL.md#ppt-style](HISTORIAL.md#ppt-style) |
| **Canvas zoom/pan estilo Prezi** | Narrativa "panorama → detalle → panorama" | Solo para un capstone puntual — alto costo de implementación (vanilla JS), riesgo de mobile/accesibilidad; no usar como default |
| **Scrollytelling con panel fijo** (`position: sticky` + `IntersectionObserver`: prosa a la izquierda, artefacto visual a la derecha que se construye según la sección visible) | Un mismo artefacto que crece o cambia de estado a medida que se explica toda la guía | BD2: `joins-subconsultas.html` (piloto), `agregacion-vistas.html`/`funciones-ventana-indices.html`/`procedimientos-triggers.html`/`seguridad-roles.html` (variante "consola a pantalla completa", `body.flow-console-mode`), `transacciones.html` (diagrama propio `.trx-*`, sin SQL real por límite de PGlite con concurrencia). TGS: `eps-retroalimentacion.html` (`.eps-*`), `jerarquia-organizacional.html` (`.jer-*`), `ciclo-vida-software.html` (`.spr-*`), `diagrama-contexto-dfd.html` (`.ctx-*`). Motor: `.flow-*` (chrome de página, fijo) + contenido agnóstico por guía (`.scrolly-*`/`.eps-*`/`.jer-*`/`.spr-*`/`.ctx-*`/`.trx-*`). **Regla:** nunca escribir dos clases con `*` separadas por `/` en un comentario CSS (`/* ... */` se cierra en el primer `*/` literal). Detalle e iteraciones: [HISTORIAL.md#scrollytelling](HISTORIAL.md#scrollytelling) |

### Nivel 2 — Estilo de sección

| Estilo de sección | Cuándo conviene | Guías que lo usan |
|---|---|---|
| **Explicación reactiva** (patrón "explorable explanations": valores editables incrustados en la propia oración, que recalculan el párrafo en vivo) | Conceptos donde mover un número y ver la consecuencia en la misma frase enseña más que un panel aparte | POO: `clases-objetos.html` (nodo Atributos), `encapsulacion.html` (validación de saldo). TGS: `eps-retroalimentacion.html` (termostato), `jerarquia-organizacional.html` (recursividad). DS: `nivel-0-mentalidad-diseno.html`. CSS: `.reactivo-*`/`.highlight.reactivo` en `guia.css`. Pendiente en BD2 (cardinalidad/normalización) y TGS (Ley de Variedad de Ashby) |
| **Scrollytelling acotado a una sección** (mismo mecanismo del Nivel 1, pero solo para un tramo de la guía, sin tocar la navegación del resto) | Una sección puntual con un artefacto que crece paso a paso, dentro de una guía por lo demás Lineal | Aún sin pilotar — candidato: ISW. **Ojo antes de construirlo:** la sección *entera* tiene que narrar a través del scroll (planteo → mecanismo → conclusión), no ser un widget en el medio con párrafos normales antes y después — eso sería Nivel 3, no Nivel 2. Confirmar con Roy si lo que pide es Nivel 2 (solo esa sección) o Nivel 1 (toda la guía) antes de construir |

### Nivel 3 — Tipo de actividad

Widget autocontenido dentro de una sección, no cambia nada de los dos niveles de arriba.

**Autocorregibles (calificadas, alimentan la barra de progreso en `localStorage`):**

| Actividad | Qué hace | Estado |
|---|---|---|
| `quiz-mc` | Opción múltiple | Default del sitio |
| `quiz-match` | Emparejar pares | Default del sitio |
| `quiz-classify` | Clasificar en categorías | Default del sitio |
| `quiz-fill` | Completar espacios | Default del sitio |
| `quiz-parsons` | Reordenar bloques de código desordenados con botones ↑/↓ (no drag-and-drop) en vez de escribirlos de cero — menor carga cognitiva, evidencia de investigación en educación de programación | Implementado (piloto: Reto Final de `clases-objetos.html`). CSS: `.quiz-parsons`/`.parsons-*`. Detalle: [HISTORIAL.md#quiz-parsons](HISTORIAL.md#quiz-parsons) |
| `quiz-decision` | Decisión narrativa con consecuencia por opción: cada botón incorrecto revela feedback (`.quiz-fb[data-key]`) sin deshabilitarse — se puede reintentar — y solo `data-correct` desbloquea (quita `hidden` a) los ids listados en `data-unlock`. Mecanismo detrás del Nivel 1 "Narrativa ramificada" | Implementado (piloto: `problema-proyecto-grado.html`; base de toda la ruta Club PO/DS). Cero CSS nuevo — reusa `.quiz-opts`/`.quiz-opt`/`.quiz-fb`. Detalle: [HISTORIAL.md#quiz-decision](HISTORIAL.md#quiz-decision) |

**Exploratorias (sin calificar, no alimentan la barra de progreso):**

| Actividad | Qué hace |
|---|---|
| **Simulación/sandbox interactivo** (sliders/formularios que alimentan un artefacto en vivo) | `dinamica-sistemas.html` (sliders de crecimiento/decrecimiento), `clase-objeto-analogias.html` ("Creador de personajes": constructor de fichas de objeto independientes que comparten métodos). CSS: `.creador-*`/`.ficha-*`. Detalle: [HISTORIAL.md#sandbox-exploratorio](HISTORIAL.md#sandbox-exploratorio) |

**Ideas evaluadas pero no construidas:** un tipo "armar el diagrama" (estilo `quiz-parsons` pero con cajas/flechas de arquitectura) y un sandbox de carga creciente para DS Nivel 5 — no decidido, documentar acá si se implementa.

No migrar guías ya publicadas a un formato/estilo/actividad nuevo salvo pedido explícito. La idea es pilotar cosas nuevas en guías nuevas, no reescribir lo existente.

## Vincular una guía a ATENZA — guías nativas

El docente vincula una guía a una `Clase` y le carga una nota + el manifest de sus `data-quiz-id` directo en el panel de ATENZA — nada de esto toca este repo. Desde ahí puede lanzarla en vivo a la clase (pantalla completa, incidencias si el estudiante sale, nota real) o dejarla como práctica libre. Esto **no cambia en nada la autoría de la guía** — sigue siendo el mismo HTML autocontenido, accesible en público sin ATENZA.

Para habilitarlo en una guía puntual: pegar el bloque `<!-- ATENZA · guía nativa en vivo -->` (ver `guias_bd/joins-subconsultas.html` o `guias_tgs/ingenieria-de-sistemas.html`, o el snippet en `DEPLOY-GUIAS-SNIPPET.md` del repo de atenza) al final de la guía, justo después del `</script>` del motor de quizzes y antes del Cloudflare Web Analytics. Se engancha una sola vez a `marcarResuelto()` (reporta cada pregunta resuelta) y a `actualizarProgreso()` (dispara `/finalizar` al 100%), y solo actúa si la guía se abrió con `?atenza_token=...&guia_intento=...` en la URL.

`ATENZA_API` = `https://api-atenza.atenzabo.com`.

**⚠️ Vincular una guía en ATENZA (nota + manifest) NO agrega el script acá solo — son dos pasos independientes.** Si se lanza una guía en clase sin haber pegado antes este bloque, el lanzamiento igual se crea y el estudiante igual puede tomarla, pero nada se reporta — termina con nota 0. Antes de lanzar una guía nueva, confirmar que ya tiene el bloque acá.

**Guías vinculadas hoy (Clase + nota en el panel de ATENZA):** `guias_bd/joins-subconsultas.html`, `guias_tgs/ingenieria-de-sistemas.html`, `guias_tgs/arquetipos-sistemicos.html`, `guias/funciones.html`.

**⚠️ Los links guardados en el panel de ATENZA para estas 4 guías apuntan al hosting viejo (`croysito.github.io`)** — actualizar a mano a `guias.atenzabo.com` en el panel; no se corrige desde este repo.

**Bloque ya pegado pero todavía sin vincular como Clase en el panel:** `guias_bd/dml.html`, `guias/taller-funciones.html`, `guias_bd/taller-joins-subconsultas.html`, `guias_bd/taller-dml.html`, `guias/taller-clases-objetos.html`, `guias_tgs/eps-retroalimentacion.html`, `guias_tgs/jerarquia-organizacional.html`, `guias_tgs/modelado-sistemas.html`, `guias_tgs/sistemas-duros-blandos.html`, `guias_tgs/ciclo-vida-software.html`, `guias_tgs/diagrama-contexto-dfd.html`, `guias_tgs/problema-proyecto-grado.html`, `guias_tgs/dinamica-sistemas.html`, `guias_bd/procedimientos-triggers.html`, `guias_bd/taller-procedimientos-triggers.html`, `guias_bd/seguridad-roles.html`, `guias_bd/taller-seguridad-roles.html`, `guias/encapsulacion.html`, `guias/taller-encapsulacion.html`, `guias/herencia.html`, `guias/taller-herencia.html`. En los talleres de BD2 el bloque solo reporta preguntas con `data-quiz-id` — los ejercicios sueltos con editor SQL no reportan nada a ATENZA, a propósito (excepto `taller-clases-objetos.html`/`taller-funciones.html`, donde **todos** los `editor-panel` ya traen `data-quiz-id`).

**A partir del 10/09, agregar este bloque por default al terminar de crear o editar significativamente una guía de TGS**, sin esperar a que se pida o se note su ausencia después.

**⚠️ Bug de URL sin corregir en el backend de ATENZA:** el link real de "Tomar la guía" puede llegar con el `?` después del `#` (ej. `...html#seccion?atenza_token=...`), dejando los parámetros en el fragmento — `location.search` los ignora y el bloque queda inactivo en silencio, sin ningún aviso. Mitigación disponible desde este repo: `paramsDeAtenza()`/`paramsAtenza()` (busca también en `location.hash`). **Ya aplicado en:** `funciones.html`, `taller-funciones.html`, `taller-clases-objetos.html`, `eps-retroalimentacion.html`, `jerarquia-organizacional.html`, `modelado-sistemas.html`, `sistemas-duros-blandos.html`, `ciclo-vida-software.html`, `diagrama-contexto-dfd.html`, `problema-proyecto-grado.html`, `dinamica-sistemas.html`, `procedimientos-triggers.html`, `taller-procedimientos-triggers.html`, `seguridad-roles.html`, `taller-seguridad-roles.html`, `encapsulacion.html`, `taller-encapsulacion.html`, `herencia.html`, `taller-herencia.html`. **Pendiente aplicar en:** `joins-subconsultas.html`, `ingenieria-de-sistemas.html`, `arquetipos-sistemicos.html`, `dml.html`, `taller-joins-subconsultas.html`, `taller-dml.html`, `funciones-ventana-indices.html`, `taller-funciones-ventana-indices.html`, `agregacion-vistas.html`, `taller-agregacion-vistas.html`, `transacciones.html`, `taller-transacciones.html`, y en el bloque de ATENZA mismo (no solo el script del `<head>`) de la variante "integrada al motor" (`fundamentos-origen.html`, `sistema.html`). Causa de fondo: bug del backend de ATENZA — corregir ahí es lo definitivo. Detalle: [HISTORIAL.md#bug-url-atenza](HISTORIAL.md#bug-url-atenza).

**Variante "integrada al motor" (`fundamentos-origen.html`, `sistema.html`):** en vez de envolver `marcarResuelto()`/`actualizarProgreso()` desde afuera, edita esas funciones directamente y cambia `quiz-match`/`quiz-classify`/`quiz-fill` a **sin reintentos** (un solo intento cuenta como "respondida"). Ninguna de las dos está vinculada como Clase. Detalle e inconsistencias pendientes: [HISTORIAL.md#atenza](HISTORIAL.md#atenza).

## Talleres con SQL en vivo (BD II)

Para reforzar una guía teórica de BD II con una clase de práctica/laboratorio, el patrón es un **taller** (`guias_bd/taller-*.html`): mismo esqueleto de guía, pero los bloques `.code` estáticos se reemplazan por bloques `.editor-panel` editables y ejecutables (idéntica estructura HTML/CSS que usan las guías de POO con Pyodide), corriendo **PostgreSQL real compilado a WebAssembly** vía [PGlite](https://pglite.dev) (`@electric-sql/pglite`, cargado perezosamente desde jsDelivr — ver `guias_bd/taller-ddl.html` como plantilla). A diferencia de sql.js (SQLite, no Postgres), PGlite es el propio motor de Postgres, así que la sintaxis y los errores que ve el estudiante son los reales.

Detalles del patrón: una única instancia de `PGlite` compartida por toda la página, un botón "🔄 Reiniciar base de datos" visible desde el inicio, y un bloque permanente de "zona de pruebas libres". Los `SELECT` se renderizan como tabla; el resto muestra éxito con filas afectadas, o el error real de Postgres en rojo.

**Reglas fijas:** los editores de ejercicios guiados parten **vacíos** (placeholder corto), el enunciado va en prosa/`.highlight` antes del panel, y copiar/cortar/pegar/soltar está **deshabilitado** en los `.editor` (bloqueo de eventos + atajos Ctrl/Cmd+C/V/X, toast `#clipboardToast`, flash `.editor.bloqueado` — ver `conectarSqlLab()`/`mostrarAvisoPortapapeles()` en `taller-ddl.html`). Antes de vaciar los editores de un taller nuevo, verificar que todo el SQL que el enunciado va a pedir ya fue enseñado en alguna guía teórica previa, no solo el tema principal del taller. Detalle: [HISTORIAL.md#talleres-sql](HISTORIAL.md#talleres-sql).

## Exámenes con SQL en vivo y verificación automática (BD II)

Para un examen parcial (no una guía ni un taller), el patrón vive en `examenes/` (no `guias_bd/`) y **no se lista en `index.html`** — solo accesible por link directo. Reutiliza el motor PGlite/`conectarSqlLab`/bloqueo de portapapeles de los talleres, pero agrega tres piezas nuevas:

- **Verificación diferencial, no comparación de texto SQL.** Cada estudiante inventa sus propios datos (sin datos fijos), así que el motor corre su propia consulta de referencia sobre la misma base de datos que el estudiante armó, y compara por valores (normaliza números a 2 decimales, trim/lowercase en texto, firma por fila, multiconjuntos ordenados). Para DDL se verifica por introspección real (`information_schema`): tablas/columnas exigidas, columnas prohibidas ausentes, al menos una PK, FKs esperadas — deliberadamente laxo en tipos exactos.
- **Nombres de tabla/columna fijos por el enunciado, el razonamiento no.**
- **Progresión gateada con recuperación ante recarga.** 6 pasos (DDL→DML→JOIN→Subconsulta→GROUP BY/HAVING→Vista) desbloqueados uno a uno; clave de profesor hardcodeada (`CLAVE_PROFESOR`) para forzar desbloqueo ante falso negativo. Cada paso aprobado guarda su SQL en `localStorage`; al reingresar se re-ejecuta paso por paso.
- **Sorteo y reparto de casos, sin backend.** `?admin=1` muestra panel de sorteo (Fisher-Yates) que genera `?caso=N&est=Nombre` por estudiante.
- **Entrega sin backend.** Certificado ✅/❌ por paso + botón que copia el SQL completo para pasarlo por el medio que use la clase. La nota final la pone el profesor con una rúbrica aparte (`examenes/rubrica-*.md`).

Piloto: `examenes/examen-agregacion-vistas.html` (3 casos: notas de venta/gimnasio/veterinaria, re-alineados a los diagramas ER oficiales del profesor el 02/09 — detalle: [HISTORIAL.md#examenes-realineacion](HISTORIAL.md#examenes-realineacion)). **Antes de publicar un examen nuevo, armar un arnés de Node con `@electric-sql/pglite` que corra los casos completos contra Postgres real** — no alcanza con leer el HTML.

## Ejecución de Python en vivo (Pyodide) — Web Worker + input() real (POO)

Las guías de POO con editor ejecutable (`variables.html`, `print.html`, `string.html`, `input.html`, `tipos-datos.html`, `condicionales.html`, `bucles.html`, `taller-repaso.html`, `funciones.html`, `clases-objetos.html`, `laberinto-robot.html`, `encapsulacion.html`) corren Pyodide en un **Web Worker** (`crearWorkerPyodide()`/`__codigoWorkerPyodide()`, cargado vía `Blob`+`importScripts`, no un archivo `.js` separado — la guía sigue siendo autocontenida). El hilo principal **nunca se bloquea**:

- Botón **"⏹ Detener"** hace `worker.terminate()` al instante.
- Timeout de 20s en el hilo principal termina y recrea el worker si el estudiante no lo hace.
- Watchdog `sys.settrace` (8s) dentro del worker, como segunda capa redundante.
- Cada ejecución corre con un dict de globals nuevo (`exec(..., {})`) — terminar el worker no pierde estado compartido porque no hay ninguno.

**`input()` real dentro del Worker:** patrón estándar (mismo que JupyterLite) — **`SharedArrayBuffer` + `Atomics.wait`/`Atomics.notify`**. El worker escribe en un buffer compartido y hace `Atomics.wait` (bloqueo real del hilo del *worker*, no de la página); el hilo principal muestra `prompt()` nativo, escribe la respuesta y hace `Atomics.notify`. El timeout de 20s se cancela y reprograma alrededor de cada `input-request`.

**Requiere aislamiento cross-origin** (`SharedArrayBuffer` no existe sin él): `_headers` en la raíz aplica `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp`, **acotado a `/guias/*`** a propósito — `guias_bd/`/`guias_tgs/` no lo necesitan. Verificado en producción que ninguno de los recursos cross-origin (jsDelivr de Pyodide, beacon de Cloudflare Web Analytics) se rompe bajo `COEP: require-corp`.

**Hosting: `guias.atenzabo.com` (Cloudflare Pages, proyecto `paginaguias`) es el dominio canónico** — para compartir con estudiantes y registrar en ATENZA. `croysito.github.io` (GitHub Pages, el hosting viejo) sigue existiendo pero está desactualizado y **no soporta `_headers`**, así que ahí `input()` nunca funciona. `paginaguias.pages.dev` también sirve el mismo contenido. Detalle de la migración: [HISTORIAL.md#pyodide](HISTORIAL.md#pyodide).

**Fallback sin `SharedArrayBuffer`:** `__crearSabInput()` detecta la ausencia y pasa `sab: null`; `inputSincrono()` lanza un `Error` claro en vez de colgarse — el resto de la guía sigue funcionando con Worker y botón Detener.

Ver `guias/variables.html` como plantilla a copiar tal cual (bloque `/* ===== Pyodide en un Web Worker ===== */` + botón Detener en `conectarEditor()`) en guías nuevas con Pyodide. El estilo `.code-btn.stop` vive en `assets/guia.css`.

## Roadmap curricular: POO (2026)

**Decisión (2026-07-30):** condicionales → bucles → funciones → clases y objetos (Opción B), para que "método" se presente como "una función que ya conocés, pero adentro de una clase".

| # | Guía | Estado |
|---|---|---|
| — | Variables, print(), String, input(), Tipos de Datos en Python | ✅ Publicadas |
| 1 | Condicionales: if/elif/else y operadores lógicos (`condicionales.html`) | ✅ Publicada (2026-07-30) |
| 2 | Bucles: while y for (`bucles.html`) | ✅ Publicada (2026-08-10) |
| 2-taller | Taller de repaso integrador: variables → bucles (`taller-repaso.html`) — [HISTORIAL.md#nota-taller-repaso](HISTORIAL.md#nota-taller-repaso) | ✅ Publicada (2026-08-12) |
| 3 | Funciones: def, parámetros, return y scope (`funciones.html`) — primera guía de POO en mezclar editor en vivo con `quiz-mc` conceptual; [HISTORIAL.md#nota-funciones](HISTORIAL.md#nota-funciones) | ✅ Publicada (2026-08-17) |
| 3-taller | Taller de repaso integrador: funciones + condicionales/bucles/listas (`taller-funciones.html`) — [HISTORIAL.md#nota-taller-funciones](HISTORIAL.md#nota-taller-funciones) | ✅ Publicada (2026-08-20) |
| 3-puente | Clase, objeto y sus amigos: analogías sin código (`clase-objeto-analogias.html`) — Mapa conceptual (6 nodos) + Explicación reactiva + sandbox "Creador de personajes"; [HISTORIAL.md#clase-objeto-analogias](HISTORIAL.md#clase-objeto-analogias) | ✅ Publicada (2026-08-31) |
| 4 | Clases y objetos desde cero (`clases-objetos.html`) — Mapa conceptual (7 nodos) + `quiz-parsons`; [HISTORIAL.md#clases-objetos](HISTORIAL.md#clases-objetos) | ✅ Publicada (2026-08-24) |
| 4-taller | Taller de repaso integrador: clases y objetos (`taller-clases-objetos.html`) — [HISTORIAL.md#nota-taller-clases-objetos](HISTORIAL.md#nota-taller-clases-objetos) | ✅ Publicada (2026-08-24) |
| 5 | El Laberinto del Robot — juego de 8 niveles, Python real (`laberinto-robot.html`) — formato `body.juego-mode` (pantalla de juego, no Lineal); [HISTORIAL.md#laberinto-robot](HISTORIAL.md#laberinto-robot) | ✅ Publicada (2026-09-07) |
| 6 | Encapsulación: atributos y métodos "privados" (`encapsulacion.html`) — Lineal (no Mapa conceptual, contenido es secuencial); [HISTORIAL.md#encapsulacion](HISTORIAL.md#encapsulacion) | ✅ Publicada (2026-09-15) |
| 6-taller | Taller de repaso integrador: encapsulación (`taller-encapsulacion.html`) — [HISTORIAL.md#taller-encapsulacion](HISTORIAL.md#taller-encapsulacion) | ✅ Publicada (2026-09-15) |
| 7 | Herencia (`herencia.html`) — Lineal; ejemplo guía Animal→Perro/Gato, ejercicio en paralelo Vehiculo→Auto/Moto | ✅ Publicada (2026-09-23) |
| 7-taller | Taller de repaso integrador: herencia (`taller-herencia.html`) | ✅ Publicada (2026-09-23) |
| 8 | Polimorfismo: mismo método, comportamiento distinto según la clase | ⏭️ **Siguiente a crear** |

**Al completar una guía:** marcar su fila como "✅ Publicada" con la fecha, actualizar la tarjeta correspondiente en `index.html`, y avanzar "⏭️ Siguiente a crear".

## Roadmap curricular: Teoría General de Sistemas (2026)

**Contexto:** a diferencia de POO y BD2, TGS no tiene cadencia fija — las guías surgen del avance real de la materia.

**`Roadmap_TGS_UAB.md`** (raíz del repo) es el plan de curso oficial de TGS, sesión por sesión — independiente de esta tabla. Al auditar o escribir una guía de TGS, revisar ese archivo: **el # de esta tabla es solo orden de publicación, no corresponde 1:1 con las sesiones del syllabus** — verificar el contenido real contra la sesión específica antes de asumir cobertura por nombre o número de fila. Ver [HISTORIAL.md#nota-mapeo-sesiones](HISTORIAL.md#nota-mapeo-sesiones) para el mapeo ya hecho.

**Archivos con dependencias cruzadas — no tocar sin revisar quién los cita:** `modelado-sistemas.html` es prerrequisito citado por nombre desde `dinamica-sistemas.html`, `arquetipos-sistemicos.html` y `sistemas-duros-blandos.html` — cubre las Sesiones 6/8/9, no la 3 (por eso existe `clasificacion-sistemas.html` aparte). `sistema.html` es la guía de apertura de la materia, no se reescribe aunque quede corta contra una sesión puntual.

| # | Guía | Estado |
|---|---|---|
| — | Fundamentos y Origen, Introducción a la TGS, Modelado (Diagramas Causales), TGS Aplicada, Cibernética Avanzada | ✅ Publicadas |
| 1 | Diagnóstico y Rediseño Organizacional con el VSM (`diagnostico-vsm.html`) | ✅ Publicada (2026-08-04) |
| 2 | Metodologías de Sistemas: Duros y Blandos (`sistemas-duros-blandos.html`) | ✅ Publicada (2026-08-10) |
| 3 | Dinámica de Sistemas: Simulación de Stocks y Flujos (`dinamica-sistemas.html`) — Lineal + sandbox exploratorio; cubre también Sesión 8 (variables auxiliares, bucles R/B) desde el 10/09 — [HISTORIAL.md#auditoria-dinamica-sesion8](HISTORIAL.md#auditoria-dinamica-sesion8) | ✅ Publicada (2026-08-11, ampliada 10/09) |
| 4 | Ingeniería de Sistemas: de la Teoría a la Práctica (`ingenieria-de-sistemas.html`) — piloto PPT-style | ✅ Publicada (2026-08-13) |
| 5 | Arquetipos Sistémicos (`arquetipos-sistemicos.html`) — PPT-style | ✅ Publicada (2026-08-17) |
| 6 | Clasificación y Propiedades de los Sistemas (`clasificacion-sistemas.html`) — cubre Sesión 3 al 100%; PPT-style | ✅ Publicada (2026-08-27) |
| 7 | Modelo E-P-S y Retroalimentación (`eps-retroalimentacion.html`) — cubre Sesión 4; primer scrollytelling de TGS; [HISTORIAL.md#eps-retroalimentacion](HISTORIAL.md#eps-retroalimentacion) | ✅ Publicada (2026-08-31) |
| 8 | Jerarquía de Sistemas y Enfoque Organizacional (`jerarquia-organizacional.html`) — cubre Sesión 5; [HISTORIAL.md#jerarquia-organizacional](HISTORIAL.md#jerarquia-organizacional) | ✅ Publicada (2026-09-01) |
| 9 | Taller de Herramientas de Modelado (`taller-modelado.html`) — cubre Sesión 9; instructivo real de Insight Maker con 16 capturas propias; [HISTORIAL.md#taller-modelado](HISTORIAL.md#taller-modelado) | ✅ Publicada (2026-09-14) |
| 10 | El Ciclo de Vida del Software como Sistema (`ciclo-vida-software.html`) — cubre Sesión 10; [HISTORIAL.md#ciclo-vida-software](HISTORIAL.md#ciclo-vida-software) | ✅ Publicada (2026-09-15) |
| 11 | Diagrama de Contexto y DFD Nivel 0 (`diagrama-contexto-dfd.html`) — cubre Sesión 11; [HISTORIAL.md#diagrama-contexto-dfd](HISTORIAL.md#diagrama-contexto-dfd) | ✅ Publicada (2026-09-15) |
| 12 | Antecedentes, Situación Problemática y Problema — proyecto de grado real del estudiante (`problema-proyecto-grado.html`) — no cubre una sesión puntual; primer piloto real de Narrativa ramificada; [HISTORIAL.md#problema-proyecto-grado](HISTORIAL.md#problema-proyecto-grado) | ✅ Publicada (2026-09-17) |

**Al completar una guía:** marcar su fila como "✅ Publicada" con la fecha, actualizar `index.html`, y agregar la siguiente fila cuando se defina el próximo tema según el avance real de la materia.

## Roadmap curricular: Base de Datos II (2026)

**Contexto:** clases 2x/semana hasta fines de octubre 2026. Objetivo: expertos en SQL relacional, básico/intermedio en NoSQL (MongoDB). Cadencia: **1 guía nueva por semana** + **1 clase de práctica/laboratorio** esa misma semana sobre la misma guía.

| # | Guía | Estado |
|---|---|---|
| — | Modelado ER, Modelado relacional y normalización | ✅ Publicadas |
| 1 | DDL y restricciones en PostgreSQL (`ddl-postgresql.html`) | ✅ Publicada (2026-07-23) |
| 1-taller | Taller de DDL (`taller-ddl.html`) | ✅ Publicada (2026-08-05) |
| 2 | DML + SELECT básico (`dml.html`) | ✅ Publicada (2026-08-05) |
| 2-taller | Taller de DML y SELECT básico (`taller-dml.html`) | ✅ Publicada (2026-08-11) |
| 3 | JOINs + Subconsultas (`joins-subconsultas.html`) — piloto de Scrollytelling (Nivel 1 completo) | ✅ Publicada (2026-08-16) |
| 3-taller | Taller de JOINs y subconsultas (`taller-joins-subconsultas.html`) | ✅ Publicada (2026-08-19) |
| 4 | Agregación (GROUP BY/HAVING) + Vistas (`agregacion-vistas.html`) — piloto variante "consola a pantalla completa" | ✅ Publicada (2026-08-26) |
| 4-taller | Taller de agregación y vistas (`taller-agregacion-vistas.html`) | ✅ Publicada (2026-08-26) |
| 5 | Funciones de ventana + Índices y EXPLAIN (`funciones-ventana-indices.html`) — variante "consola", dos hilos | ✅ Publicada (2026-08-31) |
| 5-taller | Taller de funciones de ventana e índices (`taller-funciones-ventana-indices.html`) — EXPLAIN corre contra Postgres real; [HISTORIAL.md#taller-funciones-ventana-indices](HISTORIAL.md#taller-funciones-ventana-indices) | ✅ Publicada (2026-09-09) |
| 6 | Transacciones: ACID, aislamiento, concurrencia y bloqueos (`transacciones.html`) — Scrollytelling con diagrama propio `.trx-*` (no consola SQL: PGlite no modela concurrencia real entre conexiones) | ✅ Publicada (2026-09-11) |
| 6-taller | Taller de transacciones (`taller-transacciones.html`) — locks/lost update simulados con intercalado manual en una sola sesión (PGlite es de una conexión), declarado explícitamente en el enunciado | ✅ Publicada (2026-09-11) |
| 7 | Procedimientos almacenados/funciones + Triggers (`procedimientos-triggers.html`) — variante "consola", dos hilos; resultados simulados en JS (verificados contra Postgres real de antemano), ejecución real queda para el taller | ✅ Publicada (2026-09-15) |
| 7-taller | Taller de funciones, procedimientos y triggers (`taller-procedimientos-triggers.html`) — PGlite sí soporta PL/pgSQL/triggers/CALL reales, todo se ejecuta sin simulación | ✅ Publicada (2026-09-15) |
| 8 | Seguridad: roles y control de acceso + cierre integrador del bloque SQL (`seguridad-roles.html`) — variante "consola", dos hilos (roles, GRANT/REVOKE); nueva sección `#cierre` que recorre las 8 guías del bloque | ✅ Publicada (2026-09-23) |
| 8-taller | Taller de roles y permisos (`taller-seguridad-roles.html`) — `SET ROLE` cambia identidad efectiva en una sola conexión, sin necesidad de simular nada; incluye el detalle de `GRANT` sobre `SEQUENCE` para columnas `SERIAL` | ✅ Publicada (2026-09-23) |
| 9 | Usar IA correctamente en bases de datos: dar contexto de esquema real, detectar alucinaciones (tablas/columnas inventadas), leer el EXPLAIN en vez de confiar en que "corrió", riesgo de inyección SQL en código sugerido, cuándo no delegarle a la IA (transacciones, diseño de esquema) | ⏭️ **Siguiente a crear** |
| 10 | Docker para bases de datos: `docker run` de Postgres/Mongo, volúmenes, variables de entorno, `docker-compose` con los dos motores juntos | Pendiente |
| 11 | JSON/JSONB en PostgreSQL — puente conceptual hacia Mongo: mismo motor relacional, datos semi-estructurados | Pendiente |
| 12 | Introducción a NoSQL (documentos vs relacional) + CRUD básico en MongoDB | Pendiente |
| 13 | Modelado en Mongo (embedding vs referencing) + operadores de consulta | Pendiente |
| 14 | Aggregation framework ($match/$group/$project) + $lookup | Pendiente |
| 15 | Índices en Mongo + nociones de replicación/sharding | Pendiente |
| 16 | **Proyecto integrador final** | Pendiente |

**Proyecto integrador (última fila de la tabla, semana exacta a confirmar según avance real — la cadencia de 1 guía/semana se corre con las 3 filas nuevas antes de Mongo):** no es una comparación en paralelo SQL vs Mongo — es un **sistema único con persistencia poliglota**: datos transaccionales/estructurados (pedidos, pagos, inventario, usuarios) en PostgreSQL; datos flexibles o de alto volumen (catálogo con atributos variables, logs, comentarios/reseñas, carritos de sesión) en MongoDB, ambos usados juntos desde una misma aplicación. El objetivo es que decidan *qué dato va en cuál motor y por qué*.

**Antes de publicar una guía o taller nuevo de BD2 que involucre SQL con resultados no triviales:** verificar contra Postgres real con un arnés de Node/`@electric-sql/pglite` (o ejecución en vivo si el taller ya lo hace) — no dar un resultado por bueno solo leyendo el HTML. Detalle de casos donde esto encontró diferencias reales con lo "esperado": [HISTORIAL.md#taller-funciones-ventana-indices](HISTORIAL.md#taller-funciones-ventana-indices).

**Al completar una guía:** marcar su fila como "✅ Publicada" con la fecha, actualizar `index.html`, y avanzar "⏭️ Siguiente a crear".

## Roadmap: Club de Programación — Product Owner (0 → experto)

**Contexto y decisiones (21/09/2026, tomadas explícitamente por Roy):** ruta pensada para el club, no para una materia con evaluación.

- **100% práctico, sin certificación.** No se calca el vocabulario ni el orden del Scrum Guide para PSPO/CSPO: se prioriza lo que un club realmente usa.
- **Formato: caso/narrativa con decisiones.** Cada guía sigue a un personaje ficticio con `quiz-decision` (Nivel 1 "Narrativa ramificada", motor `.flow-mode`/`.flow-flat`, sin CSS nuevo — plantilla: `guias_tgs/problema-proyecto-grado.html`).

**Convenciones propias:** carpeta `guias_po/`, archivos `nivel-N-*.html`, `QUIZ_PREFIX = "po-quiz-"`, marca de topbar "Club · PO Nivel N". Hilo narrativo: producto ficticio **TurnoYa** (app de turnos para fotocopiadora y cafetería del campus), Lucía como PO, Tomás como Scrum Master — se reusa en todos los niveles. **No lleva bloque de ATENZA** (no es materia). No se lista en `index.html`.

| Nivel | Contenido | Estado |
|---|---|---|
| 0 | Mentalidad y vocabulario: PO vs PM vs Scrum Master, Manifiesto Ágil, Scrum en 15 minutos (`nivel-0-mentalidad-po.html`) — 4 decisiones encadenadas | ✅ Publicada (2026-09-21) |
| 1 | Descubrimiento de producto: visión, investigación de usuario, historias de usuario, criterios de aceptación (`nivel-1-descubrimiento-producto.html`) — 5 decisiones encadenadas | ✅ Publicada (2026-09-21) |
| 2 | Backlog y sprint: refinamiento, priorización (MoSCoW, Value vs Effort, RICE), DoR/DoD, el PO en Planning/Daily/Review/Retro, velocity y burndown (`nivel-2-backlog-sprint.html`) | ✅ Publicada (2026-09-23) |
| 3 | Estrategia y métricas: OKRs/KPIs, roadmapping (Now-Next-Later, Story Mapping), North Star Metric, experimentación (MVP, hipótesis, A/B básico) | ⏭️ Siguiente a crear |
| 4 | Stakeholders y trade-offs: negociar alcance, presión de negocio vs. calidad, trabajo con UX e ingeniería, deuda técnica explicada a un PO | Pendiente |
| 5 | Avanzado: scaling (SAFe/LeSS conceptual), Product Ops, caso integrador de cierre (backlog real de TurnoYa de punta a punta) | Pendiente |

**Al completar una guía de esta ruta:** marcar su fila como "✅ Publicada" con la fecha y avanzar "⏭️ Siguiente a crear". No hay tarjeta en `index.html` que mover.

## Roadmap: Club de Programación — Diseñador de Sistemas (0 → experto)

**Contexto y decisiones (21/09/2026, tomadas con Roy):** segunda ruta del club, hermana de la de Product Owner.

- **Público: el Club de Programación, NO estudiantes de TGS ni de BD II.** Ninguna guía puede citar TGS ni BD II como conocimiento previo — todo se enseña desde cero. Prerrequisito real: programación básica (variables, funciones, qué es una clase); no hace falta la ruta de PO, aunque comparten el producto ficticio.
- **Scrum, sin rol "Arquitecto".** El diseño lo hace el equipo de Developers y emerge de forma incremental — se enseña a **decidir y documentar diseño dentro de sprints**, no a diseñar todo por adelantado. Vocabulario transversal: spikes, ADRs (contexto/opciones/consecuencias), DoD con atributos de calidad, deuda técnica como ítem de backlog, refinamiento técnico.
- **Ángulo "programar con IA".** Criterio para elegir qué diagramas enseñar: qué falla más una IA al pedirle código (inventar funciones → casos de uso; inventar nombres/estructura → clases; flujo equivocado → secuencia; transiciones imposibles → estados). Cada nivel cierra con un mini ejercicio de prompting.
- **100% práctico, sin certificación; formato caso/narrativa con decisiones** (`quiz-decision`, motor `.flow-mode`/`.flow-flat` — plantilla: `guias_po/nivel-0-mentalidad-po.html`).

**Convenciones propias:** carpeta `guias_ds/`, archivos `nivel-N-*.html`, `QUIZ_PREFIX = "ds-quiz-"`, marca de topbar "Club · DS Nivel N". Hilo narrativo: mismo producto **TurnoYa** visto del lado técnico — Lucía sigue como PO, Tomás como Scrum Master; personaje nuevo: **Diego**, developer que crece hasta liderar el diseño. **Sin bloque de ATENZA.** No se lista en `index.html`.

**Los 4 diagramas del Nivel 1 (elegidos con Roy):** casos de uso, clases, secuencia y estados. Quedan fuera a propósito: **ER** (se presenta como "vista de datos" dentro del diagrama de clases, no como sección propia — el club no viene de BD II) y **C4/contexto** (no se asume conocido; si hace falta, 1 párrafo dentro de 1A). Cuatro diagramas en un archivo es demasiado, así que el Nivel 1 se parte en **1A (qué y quién: alcance + estructura)** y **1B (cómo y cuándo: comportamiento + reglas)**.

| Nivel | Contenido | Estado |
|---|---|---|
| 0 | Mentalidad del diseñador: qué es diseñar, requisitos funcionales vs. atributos de calidad, trade-offs, diseño emergente vs. BDUF (`nivel-0-mentalidad-diseno.html`) — 5 decisiones encadenadas con Diego; introduce spike/ADR/DoD-con-calidad/deuda técnica como vocabulario (se profundiza en Nivel 5) | ✅ Publicada (2026-09-21) |
| 1A | Qué y quién: diagrama de **casos de uso** (actores, alcance, frontera) + diagrama de **clases** (entidades, atributos, relaciones, métodos; vista de datos tipo ER explicada desde cero) (`nivel-1a-que-y-quien.html`) — 4 decisiones encadenadas; SVG nuevos `.uml-*` en `guia.css` bajo `.diagrama-caja` | ✅ Publicada (2026-09-22) |
| 1B | Cómo y cuándo: diagrama de **secuencia** (quién llama a quién, con qué datos, en qué orden) + diagrama de **estados** (`solicitado → confirmado → atendido / cancelado / ausente`). Cierre: prompting — elegir qué diagrama darle a la IA (`nivel-1b-como-y-cuando.html`) | ✅ Publicada (2026-09-23) |
| 2 | Datos y APIs: modelado relacional vs. documentos, diseño de APIs REST, contratos, versionado, idempotencia. Decisión: ¿un endpoint gordo o varios?, ¿SQL o documentos para el carrito? | ⏭️ Siguiente a crear |
| 3 | Arquitectura y patrones: monolito modular vs. microservicios, capas/hexagonal, colas y eventos, cache, patrones de diseño realmente usados. Decisión eje: monolito o microservicios con 3 desarrolladores | Pendiente |
| 4 | Calidad y operación: escalabilidad, disponibilidad, observabilidad, seguridad básica, deuda técnica y cómo negociarla con la PO | Pendiente |
| 5 | Diseño a escala y liderazgo técnico: system design tipo entrevista, ADRs, spikes y "architectural runway" en el backlog, revisiones de diseño. Caso integrador: v2 de TurnoYa para 50.000 usuarios | Pendiente |

**Al completar una guía de esta ruta:** marcar su fila como "✅ Publicada" con la fecha y avanzar "⏭️ Siguiente a crear". No hay tarjeta en `index.html` que mover.
