# Historial de PaginaGuias

Este archivo guarda la narrativa completa de decisiones, bugs encontrados/corregidos, iteraciones y auditorías que ya están cerradas. **No se carga por default en cada conversación** — [CLAUDE.md](CLAUDE.md) tiene la versión condensada con reglas vigentes y apunta acá con `HISTORIAL.md#ancla` cuando el detalle importa (por ejemplo, para no repetir un bug ya resuelto o para entender por qué un archivo quedó como quedó).

No se edita retroactivamente salvo error de transcripción — es un registro, no una guía viva. Las reglas que siguen vigentes hacia adelante viven en CLAUDE.md, no acá.

---

## #mapa-conceptual — Mapa conceptual navegable

**Piloto: POO, `guias/clases-objetos.html` (24/08)** — chrome de página nuevo `.mapa-*` en `guia.css` (topbar+progreso de nodos+menú, mismo patrón que `.deck-*`/`.flow-*`), 7 nodos con `left`/`top` en % conectados por una capa SVG, overlay con panel reusando `.card`, fallback mobile a lista vertical bajo 700px.

**Corrección de una referencia vieja del roadmap:** `guias_tgs/sistema.html` (citado antes como ejemplo de este formato) es en realidad Lineal normal, sin ningún mapa/nodo — no es plantilla de este piloto.

**Variante en `clase-objeto-analogias.html` (31/08):** mismos 6 conceptos (clase, objeto, atributo, método, constructor... en realidad 5 conceptos, 6 nodos) con nueva variante `.mapa-ruta-grid.cols-6` en `guia.css` porque la grilla original tenía `repeat(7,...)` hardcodeado.

## #narrativa-ramificada — Narrativa ramificada / caso con decisiones

**Piloto real: TGS, `guias_tgs/problema-proyecto-grado.html` (17/09).**

**Corrección de una referencia vieja del roadmap:** `diagnostico-vsm.html` (citado antes como "estilo" de este formato) es en realidad Lineal normal con sidebar+scroll y un caso integrador de selects/quiz-open al final, sin mecanismo real de ramas con consecuencias distintas — nunca se había pilotado de verdad hasta `problema-proyecto-grado.html`. Reusa el motor `.flow-mode`/`.flow-flat` sin cambios y el vocabulario `.quiz-opts`/`.quiz-opt`/`.quiz-fb` ya genérico del sitio; el tipo de actividad nuevo es `quiz-decision`, no CSS.

Ver también la entrada de `#quiz-decision` más abajo y `#problema-proyecto-grado` en la sección de TGS para el detalle completo de esa guía.

## #ppt-style — Presentación por diapositivas (PPT-style)

**Piloto: TGS #4, `ingenieria-de-sistemas.html` (13/08)** — cambia el formato de página de verdad, porque cambia toda la navegación/estilo visual. Reutilizado tal cual en `arquetipos-sistemicos.html` y `clasificacion-sistemas.html` (TGS #5 y #6) — no es un formato nuevo en esas dos, solo reuso del motor ya estrenado.

## #scrollytelling — Scrollytelling con panel fijo

Técnica de periodismo de datos tipo Pudding.cool: `position: sticky` + `IntersectionObserver`, dos columnas, prosa que scrollea a la izquierda y un artefacto visual a la derecha que se construye/resalta según la sección visible. Uso normal es página completa, pero también puede acotarse a una sola sección.

**Piloto: BD2, `guias_bd/joins-subconsultas.html`** — página completa de verdad, sin sidebar (reemplazado por `.flow-topbar`: marca + progreso + menú + tema, mismo grado de compromiso que `.deck-*`). Motor reutilizable en `assets/guia.css` bajo `.flow-*` (chrome de página) + `.scrolly-dg-wrap`/`.scrolly-query`/`.scrolly-result-*` (contenido del panel, agnóstico del nivel). El tramo explicativo (JOINs, luego subconsultas) usa panel fijo de dos columnas; quizzes, Cheat Sheet y cierre pasan a una columna (`.flow-flat`) porque un widget interactivo o una tabla de referencia no se benefician de un panel sincronizado — igual que el deck no le da a cada slide un diagrama propio.

**Iteración real de esta guía (16/08):** se armó tres veces antes de acertar el nivel — 1ª vez fue Nivel 3 (una actividad empaquetada dentro de una sección Lineal normal); 2ª vez fue Nivel 2 a medias (la sección cambiaba de estilo pero el sidebar y el hero de la guía seguían intactos); recién la 3ª es Nivel 1 real: toda la guía, desde el primer píxel, navega distinto.

**Variante visual "consola a pantalla completa" (26/08):** mismo Nivel 1, mismo motor `.flow-*`/`.scrolly-*` (ni una línea de JS distinta), pero el panel deja de ser una tarjeta angosta y pasa a ocupar casi todo el viewport con estética de cliente SQL (consulta arriba, resultado al medio estirado con `1fr`, sin sidebar ni diagrama salvo que la guía lo pida) — piloto: `guias_bd/agregacion-vistas.html`. Para no pisar el estilo ya publicado de `joins-subconsultas.html` (vinculada en ATENZA), la variante vive bajo una clase de body separada, `flow-console-mode` (en vez de `flow-mode`), con sus propias reglas en `guia.css` justo después del bloque `.flow-*` original. Detalle importante para la próxima guía que la reuse: el div de resultado necesita `class="scrolly-result-box"` (además de su id propio) para que el `1fr` del grid del panel lo estire correctamente. Reutilizada en `funciones-ventana-indices.html`, `procedimientos-triggers.html` y `seguridad-roles.html`.

**Primer piloto en TGS (31/08):** `guias_tgs/eps-retroalimentacion.html` reutiliza el motor `.flow-*` sin ningún cambio, pero el panel no es una consulta SQL — es un diagrama E-P-S propio (cajas, flechas y un bucle de retroalimentación en SVG) que se revela por capas según el paso activo, con clases nuevas `.eps-*` en `guia.css` (mismo patrón que `.scrolly-dg-wrap`, agnóstico del contenido: cualquier guía futura con un artefacto visual propio en vez de SQL puede copiar ese bloque tal cual).

**Segundo piloto en TGS:** `jerarquia-organizacional.html` — organigrama sistémico en `.jer-*`.

**Tercer piloto en TGS:** `ciclo-vida-software.html` — sprint Scrum como sistema E-P-S en `.spr-*`.

**Cuarto piloto en TGS:** `diagrama-contexto-dfd.html` — diagrama de contexto/DFD en `.ctx-*`.

**Variante con diagrama propio en BD2:** `transacciones.html` — PGlite no modela bien locks/concurrencia real entre conexiones simultáneas, así que en vez de consola SQL usa un artefacto visual propio en `.trx-*`, agnóstico del contenido igual que `.eps-*`/`.jer-*` de TGS.

### Bug real encontrado y corregido (26/08): `*/` dentro de un comentario CSS lo cierra a la mitad

Al documentar la variante "consola a pantalla completa" en `assets/guia.css`, el comentario escribía `.flow-*/.scrolly-*` (para decir "las clases .flow-* y .scrolly-*") — pero en CSS un comentario `/* ... */` se cierra en la primera aparición literal de `*/`, sin ninguna forma de escapar la secuencia. Como el asterisco de `.flow-*` quedaba pegado a la barra del separador `/`, el comentario se cerraba ahí mismo, y todo el resto (las variables `--con-*` y buena parte de las reglas `body.flow-console-mode`) quedaba parseado como CSS real en vez de como texto — verificado con `csslint`, que mostraba "Unexpected token" apuntando literalmente al texto del comentario. Esto explica un reporte real: "el contenido se muestra pero el estilo no carga" en `agregacion-vistas.html` específicamente (la única guía que dependía de ese bloque en ese momento). Se encontró además la misma trampa, preexistente, en el comentario de "MAPA CONCEPTUAL NAVEGABLE" (`.deck-*/.flow-*`) — corregida también, aunque no había evidencia de que estuviera rompiendo `clases-objetos.html` en la práctica.

**Regla a futuro (esta sí quedó en CLAUDE.md):** nunca escribir dos nombres de clase con `*` (wildcard/prefijo) separados por `/` dentro de un comentario CSS.

## #scrollytelling-acotado — Scrollytelling acotado a una sección (Nivel 2)

Aún sin pilotar de verdad — candidato: ISW. Intento fallido real en BD2 (documentado arriba en `#scrollytelling`, "Iteración real de esta guía") sirvió de lección: la sección *entera* tiene que narrar a través del scroll, no ser un widget en el medio con párrafos normales antes y después (eso sería Nivel 3, no Nivel 2).

## #quiz-decision

Decisión narrativa con consecuencia por opción: cada botón incorrecto revela su propio feedback (`.quiz-fb[data-key]`) y no se deshabilita — se puede reintentar sin penalidad — y solo la opción correcta (`data-correct`) cierra la decisión y desbloquea (quita `hidden` a) el/los siguiente(s) tramo(s) listados en `data-unlock` (ids separados por espacio). Piloto: `guias_tgs/problema-proyecto-grado.html`; cero CSS nuevo — reusa `.quiz-opts`/`.quiz-opt`/`.quiz-fb` ya genéricos del sitio. Se convirtió en la base de toda la ruta del Club (PO y DS).

## #quiz-parsons

Reordenar bloques de código desordenados en vez de escribirlos de cero — evidencia de investigación en educación de programación: aprendizaje equivalente a escribir desde cero pero en menos tiempo y con menor carga cognitiva. Interacción por botones ↑/↓ por bloque (no drag-and-drop), mismo idioma que `quiz-classify`/`quiz-match`. Piloto: Reto Final de `guias/clases-objetos.html`, reordenando una clase `Auto`. CSS reusable en `.quiz-parsons`/`.parsons-*` de `assets/guia.css`.

## #sandbox-exploratorio — Simulación/sandbox interactivo

TGS #3, `dinamica-sistemas.html`: la página sigue siendo Lineal (sidebar+scroll) de punta a punta — lo que introdujo esa guía es este *tipo de actividad* dentro de sus secciones, no un formato de página nuevo (corrección de una vieja confusión en el roadmap, que llegó a citarla como ejemplo de formato de página).

**Variante en POO (31/08):** `clase-objeto-analogias.html` reusa la misma idea de sandbox exploratorio sin calificar, pero en vez de sliders numéricos es un **"Creador de personajes"**: un formulario de constructor genera fichas de objeto independientes (nombre/vida/ataque propios) que comparten los mismos métodos (atacar/curarse) — pensado para que el estudiante vea a mano, sin código, que una sola clase produce muchos objetos con estado propio. CSS reusable en `.creador-*`/`.ficha-*` de `guia.css`.

---

## #atenza — Vincular una guía a ATENZA, historial de bugs y variantes

### Bug corregido (2026-08-13)

Hasta esta fecha `ATENZA_API` era un placeholder (`https://api.atenza.com`) y el flag de "reportado" se guardaba *antes* de confirmar éxito, así que cualquier estudiante que completara una guía vinculada en ese período quedó marcado como reportado en su navegador sin que el backend se enterara nunca.

### Bug corregido (2026-08-17)

`joins-subconsultas.html` se lanzó como guía nativa en ATENZA sin tener el bloque de integración pegado nunca — cero respuestas ni pantalla completa, el estudiante terminó sin ninguna señal de que ya podía cerrar la pestaña, y el docente tuvo que cancelar el lanzamiento a mano, lo que calificó con nota 0/20 pese a haber contestado todo bien. Se agregó el bloque a esa página y, en ambas guías vinculadas de ese momento, un aviso flotante visible al finalizar ("✅ ¡Guía enviada!" o "⚠️ no se pudo enviar, tocá para reintentar") — antes el `/finalizar` se mandaba a ciegas, sin mostrarle nada al estudiante.

### #bug-url-atenza — Bug de URL: `?` después del `#` (encontrado 2026-08-18, mitigado guía por guía)

El link real que arma ATENZA para "Tomar la guía" puede llegar con el `?` **después** del `#` (ej. `...html#ejercicios?atenza_token=...&guia_intento=...`), lo que deja los parámetros dentro del fragmento de la URL en vez de la query string — `location.search` los ignora por completo, y con eso el bloque de ATENZA entero queda inactivo en silencio (nada se reporta, ni siquiera aparece el aviso de pantalla completa).

Causa de fondo: bug del backend de ATENZA (arma el link pegándole los parámetros a una URL que ya traía un `#ancla`, en vez de ponerlos antes del `#`) — pendiente de corregir ahí; mientras tanto, replicar `paramsDeAtenza()`/`paramsAtenza()` (busca también dentro de `location.hash`) en cada página es la mitigación disponible desde este repo. Ver CLAUDE.md para la lista vigente de qué páginas ya tienen el parche y cuáles no.

### Variante "integrada al motor" (`guias_tgs/fundamentos-origen.html` y, desde el 25/08, `guias_tgs/sistema.html`)

En vez de envolver `marcarResuelto()`/`actualizarProgreso()` desde un script aparte, esta variante edita esas dos funciones directamente (llaman a `window.atenzaReportarAutomatica`/`atenzaFinalizarGuia` si existen) y además cambia la semántica interna de `quiz-match`/`quiz-classify`/`quiz-fill` a **sin reintentos** (un solo intento cuenta como "respondida", correcta o no — antes `quiz-match` dejaba reintentar la pareja fallada y `quiz-classify`/`quiz-fill` solo se marcaban resueltos al acertar todo). Suma también un script en el `<head>` que limpia el progreso guardado en `localStorage` cuando cambia el `guia_intento` de la URL, antes de que el motor de quizzes lo lea. Ninguna de las dos páginas está vinculada como Clase todavía.

**Inconsistencia sin corregir (heredada de `fundamentos-origen.html`, replicada tal cual en `sistema.html` a pedido):** el script del `<head>` sí tolera el bug de `#bug-url-atenza` (busca también dentro de `location.hash`), pero el bloque de ATENZA de más abajo, el que de verdad extrae `token`/`guiaIntentoId` para reportar, usa `new URLSearchParams(location.search)` a secas — si el link real llega con ese formato, el bloque completo queda inactivo en silencio. Portar `paramsDeAtenza()`/`paramsAtenza()` al bloque de ATENZA mismo (no solo al script del `<head>`) es la mitigación pendiente en ambas páginas.

**Bug corregido (25/08, en ambas páginas de esta variante):** `comenzado` se ponía en `true` con el botón de pantalla completa y nunca se volvía a poner en `false`, así que los listeners de incidencias (`visibilitychange`, `fullscreenchange`, `blur`) seguían reportando a `/incidente` **después** de que `/finalizar` ya había respondido ok, y el `beforeunload` seguía mostrando el aviso "¿seguro que salís?" pese a que el propio mensaje de éxito le decía al estudiante "ya podés cerrar esta pestaña" — dos comportamientos que se contradecían entre sí. Se agregó una variable `terminado` (en `true` solo cuando `/finalizar` responde `res.ok`) y se la sumó como condición a los cuatro listeners. **Fuera de alcance de este fix:** una cancelación del lanzamiento hecha por el docente desde el panel de ATENZA no se puede detectar del lado del cliente (esta página no sondea el estado del intento) — cortar el registro de incidencias en ese caso solo se puede hacer rechazando la escritura del lado del backend.

### Nota de auditoría (25/08, `sistema.html`)

Al revisar esta guía contra el roadmap de TGS se encontró y corrigió un patrón posicional no intencional en sus actividades: los 7 `quiz-mc` de 4 opciones tenían la respuesta correcta en las posiciones 2,3,4,1,2,3,4 (ciclo ascendente perfecto), y el `quiz-classify` de Entrada/Proceso/Salida repetía el patrón diagonal fila→posición (1,2,3,1,2,3). También una pregunta (`jerarquia-1`) tenía razón largo_máx/largo_mín de 6.27 por un distractor mucho más largo que el resto. Las tres cosas se corrigieron reordenando opciones/filas (sin tocar `data-correct` semánticamente) y acortando/parejando textos; verificado con script, no a ojo.

El bloque de ATENZA de esta guía se agregó dos veces en la misma sesión: primero la variante "engancha sin tocar", después reemplazada por la variante "integrada al motor" de `fundamentos-origen.html` a pedido explícito de Roy por ser la última que usó — el motor de quizzes de `sistema.html` quedó, verificado byte a byte, idéntico al de `fundamentos-origen.html`.

También se reemplazó la sección de cierre "Reto Final: primer artefacto de análisis" (informe amplio, no correspondía a ninguna evidencia oficial) por `id="evidencia"` **"📤 Evidencia de la sesión: diagrama de componentes"**, calcada de la evidencia real de la Sesión 2 en `Roadmap_TGS_UAB.md`. Roy eligió explícitamente reemplazar en vez de sumarla aparte, para no dejar dos entregables de cierre distintos en la misma sesión.

### ⚠️ Links viejos en el panel de ATENZA

Los links de las 4 guías vinculadas guardados en el panel de ATENZA quedaron apuntando a `croysito.github.io` (el hosting viejo) — actualizar a mano a `guias.atenzabo.com`. Ver la migración de hosting en `#pyodide` más abajo.

---

## #talleres-sql — Talleres con SQL en vivo (BD II), notas de diseño

**Decisión (2026-08-05):** los `<textarea class="editor">` de los ejercicios guiados parten **vacíos** (con un `placeholder` corto tipo `-- Escribe aquí...`), no con el código ya resuelto.

**Cuidado al aplicar esto (verificado en `taller-ddl.html`):** antes de vaciar los editores de un taller, verificar que **todo** el SQL que el enunciado va a pedir escribir ya fue enseñado en alguna guía teórica previa (no solo el tema principal del taller). En `taller-ddl.html` la teoría de DDL no cubre INSERT/UPDATE/DELETE (eso es DML, todavía no publicada en ese momento) pero el taller sí los necesita para cargar datos y provocar errores — se resolvió agregando una caja `.highlight` de "Sintaxis de referencia" antes del primer uso, en vez de crear o adelantar una guía completa de DML.

**Decisión (2026-08-05):** copiar/cortar/pegar/soltar (drag&drop) deshabilitado en los `.editor` — se bloquean `copy`/`cut`/`paste`/`drop` y los atajos Ctrl/Cmd+C/V/X por `keydown`, con toast global (`#clipboardToast`) y flash rojo (`.editor.bloqueado`). Ver `conectarSqlLab()` y `mostrarAvisoPortapapeles()` en `taller-ddl.html`.

## #examenes-realineacion — Re-alineación de los 3 casos del examen a los diagramas oficiales (02/09)

Los nombres de tabla/columna originales de `examen-agregacion-vistas.html` eran inventados; Roy entregó los diagramas ER reales (`casosBD.drawio.pdf`) con los nombres exactos que los estudiantes deben usar, y se reescribió el DDL/checks de DML/las 4 consultas de referencia de los 3 casos para que coincidan al 100%. Cambios de fondo, no solo de nombres:

- **Caso 4 (notas de venta):** claves naturales (`nit`, `cod_vendedor`, `cod_producto`, `nro_nota`) reemplazadas por `id` genérico en cada tabla; `cliente.nombre` pasa a ser `cliente.razon_social`; `detalle_nota` se renombra a `venta_producto`.
- **Caso 5 (gimnasio):** cambio de diseño real — se agrega una tabla `persona(id, nombre)` compartida entre `socio` y `entrenador` (cada una con su propio `id` y un `id_persona` que apunta a `persona`); un entrenador que también es socio se modela con que su fila de `entrenador` y su fila de `socio` compartan el mismo `id_persona` — el check de DML pasó a un `EXISTS`/`NOT EXISTS` por `id_persona` en vez de un `IS NULL`/`IS NOT NULL`. `asistencia`→`ingreso`, `sesion_personalizada`→`sesion`, `fecha`+`hora`→`fecha_hora`. `sesion.tarifa` (antes prohibida por redundante) ahora se permite explícitamente como snapshot histórico de la tarifa cobrada — decisión explícita de Roy; el paso de Vista usa `SUM(se.tarifa)` en vez de `total_sesiones * tarifa_actual`.
- **Caso 6 (veterinaria):** `dueno`→`duenio`, `ci_dueno`→`id`/`ci`, `nombre_dueno`→`nombre`, `cod_animal`→`id`/`id_animal`, `nombre_animal`→`nombre`; `perro`/`pez` pasan a tener su propio `id` propio además del `id_animal` de FK.

Re-verificado con el arnés de Node/pglite (SQL de "estudiante correcto" escrito a mano para los 3 casos, contra Postgres real) antes de dejar el archivo así.

---

## #pyodide — Ejecución de Python en vivo (Pyodide), historial

**1ª iteración (2026-08-13, ya superada):** `exec()` corría síncrono en el hilo principal con un watchdog `sys.settrace` que cortaba a los 8s. Acotaba el cuelgue pero no lo eliminaba — la pestaña seguía congelándose hasta 8s de verdad.

**2ª iteración (2026-08-14, actual — ver CLAUDE.md para el detalle vigente del Worker + `input()`).**

### Bug de infraestructura encontrado y resuelto (2026-08-18): `_headers` nunca se aplicaba

El sitio se servía en `croysito.github.io` — **GitHub Pages**, que no soporta el archivo `_headers` (es una convención de Cloudflare Pages/Netlify) y no tiene forma de configurar headers HTTP custom. `_headers` estaba en el repo desde el 14/08 pero nunca tuvo efecto real: `input()` no funcionó en producción ni un solo día, en ningún navegador — el mensaje de fallback ("este navegador no soporta...") era engañoso, porque el problema nunca fue el navegador. Se migró el hosting a **Cloudflare Pages**, con dominio propio **`guias.atenzabo.com`** (subdominio del dominio de ATENZA, sin costo porque ya era de la misma cuenta/zona de Cloudflare que corre `api-atenza.atenzabo.com`). Confirmado en vivo que `/guias/*` sirve los headers correctos y que `input()` ya funciona de verdad. El proyecto de Pages se llama `paginaguias`; el dominio libre `paginaguias.pages.dev` también sirve el mismo contenido.

`croysito.github.io` sigue existiendo en paralelo (GitHub Pages no se dio de baja) pero quedó desactualizado apenas se dejó de deployar ahí.

---

## Roadmap POO — historial detallado por guía

### #clase-objeto-analogias

Puente 100% conceptual y sin código, insertado antes de `clases-objetos.html` a pedido explícito de Roy (31/08): mismos 5 conceptos (clase, objeto, atributo, método, constructor) pero explicados solo con personajes de videojuego y planos de casa. Nivel 1 Mapa conceptual navegable (6 nodos, ver `#mapa-conceptual`); Nivel 2 Explicación reactiva reusada tal cual en el nodo "Atributo"; Nivel 3 primer uso en POO de los cuatro tipos de quiz ya existentes en BD2/TGS pero nunca combinados en una sola guía de esta materia (motor copiado tal cual de `guias_bd/dml.html`) + sandbox "Creador de personajes" en el Reto Final (ver `#sandbox-exploratorio`). Infraestructura nueva en `guia.css`: `.comparacion-*` (cajas de dos analogías lado a lado), `.creador-*`/`.ficha-*` (sandbox). Quizzes auditados con script antes de publicar (posición de `data-correct` + ratio de longitud de opciones) — el `quiz-classify` final de 5 categorías reusa el mismo rótulo fijo en las 10 filas, exención documentada para vocabulario fijo. No tiene bloque de ATENZA (no pedido).

### #clases-objetos

Piloto combinado de 4 decisiones evaluadas y aprobadas con Roy: Nivel 1 Mapa conceptual navegable (7 nodos, orden sugerido pero no forzado); Nivel 2 Explicación reactiva puntual en el nodo "Atributos" (dos edades editables in situ); Nivel 3 `quiz-mc` conceptual + `quiz-parsons` nuevo (primera implementación real, ver `#quiz-parsons`) en el Reto Final. Desde el 31/08 su hero enlaza hacia atrás a `clase-objeto-analogias.html` como prerrequisito opcional.

### #laberinto-robot — Rediseño a pantalla de juego (08/09)

`laberinto-robot.html` pasó de Lineal (sidebar+scroll, los 8 niveles apilados) a un formato de página nuevo — `body.juego-mode`, tokens `--jg-*` en `guia.css` — un nivel a la vez: topbar (marca, progreso global, estrellas totales, botón Manual) + rail de niveles (bloqueados hasta resolver el anterior) + escenario (tablero + HUD de pasos/líneas/estrellas + overlay de victoria) + panel de código (objetivo, selector de ícono del robot, editor, consola), con la teoría (clase `Robot`, cheat sheet) movida a un overlay "Manual" fuera del flujo.

Implementado a partir de un handoff de diseño (`design_handoff_laberinto_juego/`, maqueta hifi aprobada `Laberinto Arcade.dc.html`) que Roy proveyó ya con capturas y specs pixel-exactas — no fue una decisión de formato evaluada en el momento, sino la ejecución de un diseño ya cerrado. El motor de laberinto, la clase `Robot` y el puente Pyodide/Worker no cambiaron (solo `DURACION_PASO` bajó de 200ms a 175ms, por spec); lo nuevo es el esqueleto de la página, el estado del juego (nivel activo, código por nivel en sesión, estrellas = líneas del código ≤ `par` del nivel) y el ícono del robot (4 variantes CSS 3D: Cubo/Flecha/Cápsula/Emoji, preferencia persistida).

Dos decisiones que el handoff dejaba explícitamente pendientes del docente se resolvieron con Roy antes de tocar código: tema forzado a oscuro (oculta el botón de tema, mismo precedente que `mapa-mode`) en vez de duplicar tokens para una variante clara; y las secciones "Bienvenido"/"¿Sabías que...?" de la versión Lineal quedan fuera de esta pantalla, sin implementar, hasta que se pida explícitamente.

Persistencia: las claves legadas `poo-quiz-...-nivel-N` se conservan tal cual para no perder progreso ya guardado; una clave nueva `laberinto-robot-juego-v1` guarda lo que no existía antes (estrellas por nivel, último nivel visitado, ícono elegido).

**Bug real encontrado y corregido durante la verificación con Playwright headless:** `.jg-win{ display:flex }` empataba en especificidad con el `[hidden]{display:none}` del user-agent, y como el CSS de autor siempre gana ese empate, el overlay de victoria quedaba visible desde la carga de la página pese a su atributo `hidden` — mismo bug ya conocido y documentado en `.secreto-hallado[hidden]` en `guia.css`; se corrigió agregando `.jg-win[hidden]{ display:none; }`.

Verificado end-to-end: un script Playwright headless resuelve el nivel 1 de verdad (Pyodide real vía WebSocket CDP, con headers COOP/COEP servidos localmente para habilitar `SharedArrayBuffer`), confirma el overlay de victoria con el texto/estrellas correctos, el desbloqueo del nivel 2, y el contenido exacto de `localStorage` en ambas claves.

### #encapsulacion

Formato evaluado explícitamente con Roy antes de escribir nada (15/09): Nivel 1 Lineal, no Mapa conceptual — a diferencia de `clases-objetos.html` (facetas de una misma cosa, cualquier orden), el contenido acá es un argumento que se construye en secuencia (el problema de acceso directo → convención `_` → convención `__`/name mangling → getters/setters clásicos → `@property` → validación en el setter). Nivel 3 editor Pyodide en vivo + 3 quiz-mc conceptuales. Nivel 2 piloto de Explicación reactiva en la sección de validación (input editable con el valor propuesto para `saldo`).

Quizzes auditados con script: 3/1/4 sin repetir, sin patrón diagonal, ratios 1.27–1.39. Los 6 ejemplos de código y el Reto Final se verificaron corriendo el Python real antes de escribir la salida esperada, y se verificó end-to-end con Playwright headless.

### #taller-encapsulacion

Cuarto taller de consolidación. 9 problemas en 3 bloques (convenciones/name mangling, getters-setters clásicos, `@property`+`raise`) más reto final de transferencia entre dos objetos `CuentaBancaria`. Alcance explícitamente fuera: herencia, polimorfismo y `try`/`except` — varios ejercicios piden provocar un `AttributeError`/`ValueError` a propósito, con aviso explícito de que ese es el resultado esperado. Verificado corriendo Python real de una solución de referencia para cada uno, y end-to-end con Playwright headless (bloqueo de copiar/pegar, ejecución real en el editor).

### #nota-taller-repaso

A diferencia de los talleres de BD II (PGlite/SQL), `taller-repaso.html` reutiliza el motor de Pyodide de POO. Ejercicios con editor vacío, enunciado en `.highlight` antes del panel. No usa el motor de quizzes. Listas limitadas a `for elemento in lista` (sin indexado ni `.append()`).

### #nota-funciones

Primera guía de POO en mezclar los dos motores — 100% editor en vivo para código, pero suma 2 `quiz-mc` conceptuales (parámetro vs. argumento, scope). Mini motor de quiz-mc propio (`QUIZ_PREFIX = "poo-quiz-"`, no choca con BD2/TGS) y un `.quiz-tracker` en la intro — decisión explícita de Roy, no default.

### #nota-taller-funciones

Decisión evaluada explícitamente con Roy (20/08): ni un taller aislado de sintaxis de funciones ni saltar directo a `clases-objetos.html`, sino un segundo taller de consolidación integrando bucles+condicionales+listas *dentro de* funciones, incluyendo funciones que llaman a otras funciones. Se evaluó agregar recursión y `*args`/`**kwargs` en la misma conversación y se decidió dejarlos fuera por ahora (mantiene el curso liviano según la Opción B) — quedan mencionados como promesa a futuro en el "¿Sabías que...?".

### #nota-taller-clases-objetos

Tercer taller de consolidación, Lineal sidebar+scroll (no el Mapa conceptual de `clases-objetos.html` — los talleres siguen el patrón de taller, no el de la guía teórica que refuerzan). Alcance fuera: herencia, polimorfismo, encapsulación, indexado/`.append()`. Introduce `self.otro_metodo()` y pasar un objeto como parámetro. El reto final reutiliza a propósito el "boletín de notas" de `taller-funciones.html`, reescrito con cada estudiante como objeto.

---

## Roadmap TGS — historial detallado por guía

### #nota-mapeo-sesiones — Nota de mapeo de sesiones (27/08, ampliada 31/08 y 01/09)

Al auditar `modelado-sistemas.html` contra la Sesión 3 del roadmap se encontró que **no la cubre en absoluto** — su contenido real (bucles causales, arquetipos, stock/flujo, retardos, efecto látigo) corresponde a las Sesiones 6, 8 y 9, no a la Sesión 3 (clasificación/propiedades de sistemas). No se tocó ese archivo — sigue siendo prerrequisito citado por nombre desde `dinamica-sistemas.html`, `arquetipos-sistemicos.html` y `sistemas-duros-blandos.html`, así que reescribirlo hubiera roto esos tres enlaces. En su lugar se creó `clasificacion-sistemas.html` como la guía que sí cubre la Sesión 3.

El mismo chequeo se repitió el 31/08 contra la Sesión 4: `sistema.html` toca E-P-S básico y feedback positivo/negativo a nivel introductorio, sin "control y ajuste" ni "caja negra vs. caja blanca" — se creó `eps-retroalimentacion.html` sin tocar `sistema.html`.

El 01/09 se repitió contra la Sesión 5: `sistema.html` enseña jerarquía con ejemplo académico genérico, sin subsistemas funcionales de empresa; `diagnostico-vsm.html` cubre recursividad con el lente del VSM, no áreas funcionales clásicas; `clasificacion-sistemas.html` solo tiene un diagrama de ejemplo puntual — se creó `jerarquia-organizacional.html` sin tocar ninguna de las tres.

Esta tabla no está numerada 1:1 contra las sesiones del `Roadmap_TGS_UAB.md` — si se audita otra guía contra una sesión específica, verificar el contenido real, no asumir por el número de fila o el nombre del archivo.

### #auditoria-modelado-sesion6 — Auditoría de `modelado-sistemas.html` contra la Sesión 6 (03/09)

Sesión 6: pensamiento lineal vs. sistémico, arquetipos "límites del crecimiento" y "éxito para quien tiene éxito" como ejemplos nombrados, introducción a stocks y flujos; actividad: identificar un arquetipo en un problema real de TI (ej. deuda técnica que crece).

- **Corregido:** faltaba una actividad dedicada a "identificar un arquetipo en un problema de TI". Se agregó, al final de `#arquetipos`, un caso de deuda técnica que crece con su propio `quiz-mc` (`arquetipos-ti`), mapeado a "límites del crecimiento".
- **Descartado a propósito:** "éxito para quien tiene éxito" — `arquetipos-sistemicos.html` ya lo enseña como contenido nuevo (da por sabidos "los tres primeros arquetipos" de esta guía); agregarlo acá lo hubiera duplicado.
- **No se tocó** el resto del contenido (bucles refuerzo/balance, stock/flujo a fondo, retardos/oscilación/efecto látigo) pese a exceder la Sesión 6 hacia las Sesiones 8-9: en ese momento `dinamica-sistemas.html` y `arquetipos-sistemicos.html` declaraban por escrito que asumían ya vistas acá esas secciones — recortarlas habría roto esas promesas ya publicadas (esto cambió el 10/09 para `dinamica-sistemas.html`, ver `#auditoria-dinamica-sesion8`). Por la misma razón no se renombró el archivo.

Auditoría de sesgo posicional con script (no encontrado a ojo antes): la posición de `data-correct` entre las 14 preguntas de opción múltiple originales formaba un ciclo ascendente 1→2→3→4 casi perfecto repetido 3 veces seguidas, y los dos `quiz-classify` tenían el mismo patrón alternado `[1,2,1,2]` idéntico entre sí. Corregido reordenando opciones/filas sin tocar `data-correct` semánticamente; seis preguntas con ratio fuera de rango (hasta 4.78) emparejadas. Dos ratios quedaron sobre el umbral a propósito por vocabulario fijo (`repaso-1`, nombres propios; dos V/F).

### #auditoria-dinamica-sesion8 — Auditoría de `dinamica-sistemas.html` contra la Sesión 8 (10/09)

Sesión 8: stocks, flujos, variables auxiliares, bucles de refuerzo/balance; actividad: modelar crecimiento/decrecimiento (ej. usuarios activos de una app). Ninguna guía la cubría al 100%: variables auxiliares no aparecía en ninguna de las 13 guías de TGS (verificado con grep), los bucles de refuerzo/balance solo se enseñaban en `modelado-sistemas.html`, y el origen de Forrester solo aparecía como trivia. A pedido explícito de Roy de no tocar `modelado-sistemas.html`, se editó `dinamica-sistemas.html`:

- Sección nueva "Bucles de refuerzo y de balance" (`#refuerzo-balance`) con sandbox nuevo "Usuarios activos de una app" (20 semanas, dos sliders: tasa de referidos=bucle R, tasa de bajas=bucle B). Función nueva `simularApp()`.
- Sección nueva "Variables auxiliares" (`#auxiliares`): la brecha (objetivo − stock) como ejemplo, más un `quiz-classify` de 6 filas.
- Forrester pasó de trivia a contenido enseñado (highlight nuevo en la intro).
- Se quitó el bloque "📎 Prerrequisito" que pedía haber visto `modelado-sistemas.html` antes.
- Cheat Sheet ampliada.

Quizzes auditados con script: 3 preguntas nuevas dentro de rango (1.14–1.47), y se corrigió de paso un ratio preexistente fuera de rango (`retraso-mc1`, 2.12 → dentro de rango) no relacionado con este cambio. Verificado end-to-end con Playwright headless: el sandbox reacciona a los sliders con el resultado numérico correcto en ambos escenarios.

### Bloque de ATENZA agregado a `dinamica-sistemas.html` (10/09)

Tercera vez que una guía de TGS lo consigue "a posteriori" (mismo patrón que `modelado-sistemas.html` 03/09 y `sistemas-duros-blandos.html` 07/09). Se agregó la variante "engancha sin tocar el motor" con `paramsDeAtenza()` incluido desde el vamos. Verificado con Playwright headless en ambos casos (con y sin parámetros de ATENZA).

### #eps-retroalimentacion

Ver `#scrollytelling` para el detalle del formato. Cubre la Sesión 4 al 100%. Suma piloto de Explicación reactiva (termostato editable). Quizzes auditados con script.

### #jerarquia-organizacional

Ver `#scrollytelling`. Cubre la Sesión 5. Organigrama sistémico de TecnoAndina: suprasistema → sistema → 4 subsistemas funcionales → bracket de jerarquía → recursividad (TI se abre en Desarrollo/Soporte/Infraestructura). Piloto de Explicación reactiva (recursividad organizacional, potencia). Quizzes auditados con script: primer borrador tenía la posición correcta repetida en "opción 2" tres preguntas seguidas y dos ratios fuera de rango (1.62, 2.81); corregido.

### #taller-modelado — Iteración real de esta guía (14/09)

Cubre la Sesión 9. La primera versión seguía el criterio "el sitio nunca embebe herramientas externas" y armaba un comparador de escenarios propio en JS vanilla, con Insight Maker solo mencionado de pasada — Roy la rechazó explícitamente ("no me convence para nada") y pidió lo opuesto: un instructivo real de Insight Maker con capturas de pantalla propias. Se reconstruyó de cero como tutorial paso a paso con 16 capturas reales (`guias_tgs/img/taller-modelado/`, ~2.4 MB — primera guía del repo con imágenes rasterizadas, todas las demás usan SVG inline): Roy fue haciendo cada paso en insightmaker.com de verdad mientras mandaba una captura por paso, y el instructivo final quedó calcado a esos clics reales (incluyendo el descubrimiento, recién en el tercer intento del propio Roy, del menú real EDIT → Compare Results...). El comparador propio en JS se sacó por completo.

Quizzes auditados con script: primer borrador tenía la posición de `data-correct` en la opción 1 en 5 de 6 preguntas (sesgo severo) y una pregunta con ratio 2.04; corregido. Verificado con Playwright headless: 16 imágenes cargan con dimensiones reales, no queda código del comparador viejo, motor de quiz/progreso responde.

### #ciclo-vida-software

Ver `#scrollytelling`. Cubre la Sesión 10. Sprint Scrum como sistema E-P-S, dos bucles de retroalimentación (Retrospectiva interna / Sprint Review externa), flechas de intercambio con el entorno, caja punteada de sistema sociotécnico. Quizzes auditados con script: primer borrador tenía la posición correcta sistemáticamente en la opción más larga (ratios hasta 1.94) y la posición 1 sin usar nunca; corregido. Verificado con Playwright headless.

### #diagrama-contexto-dfd

Ver `#scrollytelling`. Cubre la Sesión 11. Sistema de e-commerce como Diagrama de Contexto (frontera + 3 actores externos), paso de equivalencia con UML, apertura en DFD Nivel 0. Nota explícita sobre convenciones distintas de numeración entre libros de texto. Quizzes auditados con script: primer borrador tenía la posición correcta nunca en la opción 1 y una pregunta con la correcta como la más corta (ratio 2.18); corregido. El `quiz-classify` de 4 categorías fijas reusa el mismo set de rótulos en las 6 filas (exención de vocabulario fijo). Verificado con Playwright headless.

### #problema-proyecto-grado

No cubre ninguna sesión puntual: guía-síntesis pedida explícitamente por Roy para aplicar las herramientas de diagnóstico ya vistas (jerarquía/entorno, rich picture+CATWOE, arquetipos/causal loops, caja negra/E-P-S) a la construcción del Capítulo 1 del proyecto de grado real del estudiante (confirmado con Roy que no es el Proyecto Integrador de este curso). Primer piloto real de Narrativa ramificada del sitio (ver `#narrativa-ramificada`). Sigue a Marisol resolviendo el problema de una cooperativa ficticia ("Nueva Esperanza") a través de 3 decisiones encadenadas con `quiz-decision`. El estado "desbloqueado" se restaura solo al recargar la página leyendo `localStorage`.

Quizzes auditados con script: primer borrador tenía un `quiz-classify` con dos botones idénticos ("Relleno"/"Relleno") en una fila por error de tipeo y dos preguntas con ratio fuera de rango (1.60, 2.10); corregido. Verificado con Playwright headless: las 3 decisiones muestran consecuencia y permiten reintentar antes de desbloquear, el desbloqueo persiste tras recargar, los cuatro tipos de quiz clásicos responden.

---

## Roadmap BD II — historial detallado por guía

### #taller-funciones-ventana-indices — Verificación (09/09)

Antes de publicar se corrió cada consulta (ROW_NUMBER/PARTITION BY/RANK/DENSE_RANK/LAG/LEAD/SUM() OVER, EXPLAIN antes/después del índice) contra Postgres real vía `@electric-sql/pglite` en Node. Con 50.000 filas y un filtro de selectividad ~5% (`vendedor`, 20 valores), Postgres real elige un plan **Bitmap Heap Scan** apoyado en un **Bitmap Index Scan**, no un "Index Scan" simple como el ejemplo ilustrativo de la guía teórica — el taller explica esa diferencia en vez de prometer un plan que Postgres no elegiría. El Reto final agrega un filtro por `id` (selectividad de una fila entre 50.000) para mostrar recién ahí un Index Scan puro.

---

## Club — Product Owner y Diseñador de Sistemas

Sin historial adicional más allá de lo ya condensado en CLAUDE.md — ambas rutas son recientes (21/09 en adelante) y su detalle de auditoría de quizzes/verificación con Playwright ya está resumido ahí mismo por guía.
