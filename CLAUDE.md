# PaginaGuias

Sitio estático (HTML/CSS/JS puro, sin build step) con material de "aula invertida" para las 4 materias que dicta Roy Carrasco en la Facultad de Ingeniería de Sistemas de la UAB: POO, Base de Datos II, Ingeniería de Software y Teoría General de Sistemas.

- `index.html` — landing con las 4 materias y el grid de guías (tarjetas "disponible" vs "próximamente"). Al publicar una guía nueva, mover su tarjeta de "próximo" a "disponible" y agregar la siguiente como "próximo".
- `guias/`, `guias_bd/`, `guias_tgs/` — una página HTML autocontenida por guía.
- `assets/guia.css` — hoja de estilos compartida por todas las guías (sidebar, quizzes, modo oscuro, bloques `.code`).

## Patrón de una guía

Cada guía de `guias_bd/` (y las demás carpetas) sigue el mismo esqueleto: sidebar con buscador y nav por secciones, hero, secciones `<section class="container">` con `.card`, bloques `.highlight` para notas importantes, tablas `.tabla`, bloques `.code`/`.code-header` para SQL (sin resaltado de sintaxis, ni ejecución en vivo), y actividades interactivas (`quiz-mc`, `quiz-match`, `quiz-classify`, `quiz-fill`) autocorregibles con progreso guardado en `localStorage`. El motor de quizzes y el boilerplate de script (menú, tema, progreso) se copian tal cual de una guía existente — no se reinventan. Al final siempre hay Cheat Sheet + "¿Sabías que...?" + footer.

Al crear una guía nueva, usar como plantilla la guía más reciente de esa carpeta (ver `guias_bd/ddl-postgresql.html` como ejemplo reciente).

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
| 2 | Bucles: while y for (range, break/continue) (`bucles.html`) | ⏭️ **Siguiente a crear** |
| 3 | Funciones: def, parámetros, return y scope (`funciones.html`) | Pendiente |
| 4 | Clases y objetos desde cero (`clases-objetos.html`) | Pendiente |

**Al completar una guía:** marcar su fila como "✅ Publicada" con la fecha, actualizar la tarjeta correspondiente en `index.html` (de "próximo" a "disponible", y agregar la siguiente como "próximo"), y avanzar la fila "⏭️ Siguiente a crear" a la guía que sigue en la tabla.

## Roadmap curricular: Base de Datos II (2026)

**Contexto:** clases 2x/semana hasta la última semana de octubre de 2026. Objetivo: que los estudiantes terminen expertos en SQL relacional y con nivel básico/intermedio en NoSQL (MongoDB). Cadencia acordada: **1 guía nueva por semana** (clase de teoría/aula invertida) + **1 clase de práctica/laboratorio** esa misma semana sobre la misma guía (sin guía nueva ese día).

| # | Guía | Estado |
|---|---|---|
| — | Modelado Entidad-Relación (`modelado-er.html`) | ✅ Publicada |
| — | Modelado relacional y normalización (`normalizacion.html`) | ✅ Publicada |
| 1 | DDL y restricciones en PostgreSQL (`ddl-postgresql.html`) | ✅ Publicada (2026-07-23) |
| 2 | DML (INSERT/UPDATE/DELETE) + SELECT básico (WHERE/ORDER BY/LIMIT) | ⏭️ **Siguiente a crear** |
| 3 | JOINs (todos los tipos) + Subconsultas | Pendiente |
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
