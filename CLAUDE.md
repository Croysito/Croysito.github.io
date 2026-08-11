# PaginaGuias

Sitio estático (HTML/CSS/JS puro, sin build step) con material de "aula invertida" para las 4 materias que dicta Roy Carrasco en la Facultad de Ingeniería de Sistemas de la UAB: POO, Base de Datos II, Ingeniería de Software y Teoría General de Sistemas.

- `index.html` — landing con las 4 materias y el grid de guías (tarjetas "disponible" vs "próximamente"). Al publicar una guía nueva, mover su tarjeta de "próximo" a "disponible" y agregar la siguiente como "próximo".
- `guias/`, `guias_bd/`, `guias_tgs/` — una página HTML autocontenida por guía.
- `assets/guia.css` — hoja de estilos compartida por todas las guías (sidebar, quizzes, modo oscuro, bloques `.code`).

## Patrón de una guía

Cada guía de `guias_bd/` (y las demás carpetas) sigue el mismo esqueleto: sidebar con buscador y nav por secciones, hero, secciones `<section class="container">` con `.card`, bloques `.highlight` para notas importantes, tablas `.tabla`, bloques `.code`/`.code-header` para SQL (sin resaltado de sintaxis, ni ejecución en vivo), y actividades interactivas (`quiz-mc`, `quiz-match`, `quiz-classify`, `quiz-fill`) autocorregibles con progreso guardado en `localStorage`. El motor de quizzes y el boilerplate de script (menú, tema, progreso) se copian tal cual de una guía existente — no se reinventan. Al final siempre hay Cheat Sheet + "¿Sabías que...?" + footer.

Al crear una guía nueva, usar como plantilla la guía más reciente de esa carpeta (ver `guias_bd/ddl-postgresql.html` como ejemplo reciente).

## Formatos alternativos de guía (evaluar antes de crear una guía nueva)

El esqueleto lineal de arriba (sidebar + scroll por secciones) **no es la única forma posible** — es el mejor default para contenido procedimental/secuencial (sintaxis, pasos), pero no siempre es el mejor formato para contenido más conceptual/relacional (típicamente TGS, y ocasionalmente Ingeniería de Software). El motor de quizzes (`quiz-mc`, `quiz-match`, `quiz-classify`, `quiz-fill`) y la infraestructura (progreso en `localStorage`, tema oscuro) son independientes del contenedor/navegación y se reutilizan igual en cualquier formato.

**Antes de crear una guía nueva, evaluar el tipo de contenido y sugerirle a Roy la(s) mejor(es) opción(es) de formato de esta lista, con el patrón lineal como default si ninguna aplica claramente mejor:**

| Formato | Cuándo conviene | Encaje típico |
|---|---|---|
| **Lineal (default actual)** | Contenido con orden natural, procedimental | POO, BD2 (la mayoría) |
| **Mapa conceptual navegable** (nodos = conceptos, clic expande tarjeta + quiz, líneas = relaciones) | Conceptos muy interrelacionados, sin orden fijo | TGS: `sistema.html`-style (elemento/límite/entorno) |
| **Narrativa ramificada / caso con decisiones** (el estudiante elige, ve consecuencias, distintas ramas llevan a distintos quizzes) | Diagnóstico, toma de decisiones, casos aplicados | TGS: estilo `diagnostico-vsm.html`, capstones |
| **Simulación/sandbox interactivo** (sliders que alimentan un diagrama en vivo) | Contenido con retroalimentación/dinámica que se entiende mejor manipulando que leyendo | TGS: diagramas causales, bucles de refuerzo/balance |
| **Línea de tiempo interactiva** | Contenido con eje histórico/evolutivo real | TGS: origen y evolución de la teoría |
| **Canvas zoom/pan estilo Prezi** | Narrativa "panorama → detalle → panorama" | Solo para un capstone puntual — alto costo de implementación (sin librería, en vanilla JS), riesgo de mobile/accesibilidad; no usar como default |

No migrar guías ya publicadas a un formato nuevo salvo pedido explícito. La idea es pilotar formatos alternativos en guías nuevas (empezando por la guía TGS #2 "por definir" del roadmap), no reescribir lo existente.

## Vincular una guía a ATENZA (opcional, 05/08)

Fusión con ATENZA: el docente puede asociar una guía a una `Clase` para que el sistema sepa qué estudiantes hicieron la pre-clase (formativo, sin nota). Esto **no cambia en nada la autoría de la guía** — sigue siendo el mismo HTML autocontenido de siempre, y sigue siendo accesible en público sin ATENZA. Solo aplica a las guías que Roy decida vincular desde el panel de una `Clase` en ATENZA, no a todas.

Para habilitarlo en una guía puntual: copiar el bloque `<!-- ATENZA · guía completada -->` (ver `guias_bd/dml.html` como ejemplo) al final de la guía, justo después del `</script>` del motor de quizzes y antes del Cloudflare Web Analytics. El bloque no toca el motor de quizzes existente — se engancha a `actualizarProgreso()` (ya definida arriba) para detectar cuándo el estudiante completó el 100% del quiz, y hace un `POST` silencioso al backend de ATENZA solo si la guía se abrió con `?atenza_token=...&guia=...` en la URL (eso lo agrega ATENZA al armar el link; accedida directo, como siempre, el bloque no hace nada).

**Actualizar `ATENZA_API`** dentro del bloque con la URL pública real del backend antes de depender de esto en producción (hoy tiene un placeholder).

## Talleres con SQL en vivo (BD II)

Para reforzar una guía teórica de BD II con una clase de práctica/laboratorio, el patrón es un **taller** (`guias_bd/taller-*.html`): mismo esqueleto de guía, pero los bloques `.code` estáticos se reemplazan por bloques `.editor-panel` editables y ejecutables (idéntica estructura HTML/CSS que usan las guías de POO con Pyodide), corriendo **PostgreSQL real compilado a WebAssembly** vía [PGlite](https://pglite.dev) (`@electric-sql/pglite`, cargado perezosamente desde jsDelivr — ver `guias_bd/taller-ddl.html` como plantilla). A diferencia de sql.js (que es SQLite, no Postgres), PGlite es el propio motor de Postgres, así que la sintaxis y los mensajes de error que ve el estudiante son exactamente los reales.

Detalles del patrón (ver `taller-ddl.html`): una única instancia de `PGlite` compartida por toda la página (para que los ejercicios se acumulen sobre la misma base de datos), un botón "🔄 Reiniciar base de datos" visible desde el inicio, y un bloque permanente de "zona de pruebas libres". Los resultados de `SELECT` se renderizan como tabla; el resto de sentencias muestra un mensaje de éxito con filas afectadas, o el error real de Postgres en rojo.

**Decisión (2026-08-05):** los `<textarea class="editor">` de los ejercicios guiados parten **vacíos** (con un `placeholder` corto tipo `-- Escribe aquí...`), no con el código ya resuelto. El enunciado de cada ejercicio va en prosa o en una lista dentro de un `.highlight` justo antes del `.editor-panel` (nombres de tabla/columna, tipos, restricciones, qué INSERT/UPDATE/DELETE hay que escribir), y el estudiante escribe el SQL de cero. Solo la "zona de pruebas libres" y el "Reto final" ya seguían este criterio; ahora aplica a todos los ejercicios numerados del taller.

**Cuidado al aplicar esto:** antes de vaciar los editores de un taller, verificar que **todo** el SQL que el enunciado va a pedir escribir ya fue enseñado en alguna guía teórica previa (no solo el tema principal del taller). En `taller-ddl.html` la teoría de DDL no cubre INSERT/UPDATE/DELETE (eso es DML, guía #2 del roadmap de BD II, todavía no publicada) pero el taller sí los necesita para cargar datos y provocar errores — se resolvió agregando una caja `.highlight` de "Sintaxis de referencia" con la forma genérica de esas tres instrucciones (sin resolver ningún ejercicio) antes del primer uso, en vez de crear o adelantar una guía completa de DML.

**Decisión (2026-08-05):** en los `.editor` de los talleres, copiar/cortar/pegar/soltar (drag&drop) está deshabilitado — el código se escribe a mano, no se trae de otro lado. Se bloquean los eventos `copy`/`cut`/`paste`/`drop` y, como capa extra, los atajos Ctrl/Cmd+C/V/X por `keydown`, con un aviso breve en un toast global (`#clipboardToast`) y un flash rojo (`.editor.bloqueado`) en el propio editor. Ver `conectarSqlLab()` y `mostrarAvisoPortapapeles()` en `taller-ddl.html` como referencia a copiar tal cual en los próximos talleres.

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
| 3 | Funciones: def, parámetros, return y scope (`funciones.html`) | ⏭️ **Siguiente a crear** |
| 4 | Clases y objetos desde cero (`clases-objetos.html`) | Pendiente |

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
| 3 | *(por definir según avance de la materia)* | Pendiente |

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
| 3 | JOINs (todos los tipos) + Subconsultas | ⏭️ **Siguiente a crear** |
| 4 | Agregación (GROUP BY/HAVING) + Vistas | Pendiente |
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
