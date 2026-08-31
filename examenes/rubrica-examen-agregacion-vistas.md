# Rúbrica de evaluación — Examen DDL a Vistas (BD II)

Complementa el certificado automático de `examen-agregacion-vistas.html`. El certificado ya confirma que cada paso pasó una verificación estructural/lógica mínima sobre los propios datos que el estudiante inventó — usa esta rúbrica para matizar la nota según la **calidad** del SQL que te copió (pedile el texto con el botón "📋 Copiar todo mi examen" al terminar), no para re-verificar lo que el sistema ya confirmó.

Total: **100 puntos** (dividir entre 5 para escala 0-20).

Aplica igual para los casos 4 (notas de venta), 5 (gimnasio) y 6 (veterinaria) — solo cambian los nombres de tabla/columna, no los criterios.

## Paso 1 — DDL / Diseño del esquema (25 pts)

| Criterio | Puntos |
|---|---|
| Todas las tablas y columnas obligatorias del caso, con tipos de dato razonables | 10 |
| Claves primarias y foráneas correctas (incluye tabla-por-subclase en el caso 6) | 8 |
| Las reglas de negocio del caso quedan resueltas por el diseño, sin columnas derivadas/redundantes guardadas (comisión en vendedor no en nota, sin subtotal, sin datos de dueño/animal repetidos en atención, etc.) | 7 |

## Paso 2 — DML / Carga de datos (15 pts)

| Criterio | Puntos |
|---|---|
| Datos coherentes, completos y que cumplen las cantidades mínimas pedidas | 8 |
| Integridad referencial respetada (sin huérfanos) | 7 |

## Paso 3 — JOIN (15 pts)

| Criterio | Puntos |
|---|---|
| INNER JOIN correcto entre las tablas necesarias | 8 |
| Columnas solicitadas y resultado correctos | 7 |

## Paso 4 — Subconsulta (15 pts)

| Criterio | Puntos |
|---|---|
| Subconsulta bien construida (IN/EXISTS o comparación con función de agregación) | 8 |
| Resultado correcto | 7 |

## Paso 5 — GROUP BY / HAVING (15 pts)

| Criterio | Puntos |
|---|---|
| Agrupación y función de agregación correctas | 8 |
| HAVING aplicado correctamente sobre el grupo (no como WHERE) | 7 |

## Paso 6 — Vista (15 pts)

| Criterio | Puntos |
|---|---|
| `CREATE VIEW` y consulta con `WHERE` correctos | 7 |
| `CREATE OR REPLACE VIEW` con la columna nueva, correcto | 8 |

---

## Cómo se administra el examen

1. Abrí `examen-agregacion-vistas.html?admin=1`, pegá la lista de estudiantes (uno por línea) y tocá "Sortear y generar links". Te da una tabla Nombre / Caso / Link.
2. Repartí a cada estudiante su link propio (o decile de palabra qué caso le tocó, y que lo elija en el desplegable — el link es solo para no tener que anunciarlo en voz alta).
3. El cronómetro de 2 horas arranca cuando el estudiante toca "Comenzar examen" y sigue corriendo aunque cierre o recargue la pestaña.
4. Si un estudiante recarga o su base de datos se corrompe, el botón "🔁 Reconstruir mi base de datos" (o el aviso automático al reingresar) vuelve a ejecutar su propio SQL ya aprobado — no pierde el progreso.
5. Si el verificador automático de algún paso da un falso negativo, cada paso tiene un botón "🔑 Clave del profesor" — clave por defecto `bd2-2026-roy` (cambiala en el archivo antes de rendir el examen si querés otra, buscá `CLAVE_PROFESOR` en el `<script>`).
6. Al completar el paso 6 aparece el certificado. Pedile al estudiante el botón "📋 Copiar todo mi examen" y que te pegue el texto (por Classroom, WhatsApp, lo que uses) — ahí tenés el SQL completo de los 6 pasos para aplicar esta rúbrica.

## Nota de mantenimiento

Los 3 casos están definidos en el objeto `CASOS` dentro del `<script>` de `examen-agregacion-vistas.html` (uno por cada `4`, `5`, `6`). Cada caso trae: el contexto del enunciado, la especificación de tablas/columnas/FK para el DDL, la lista de chequeos de datos mínimos para el DML, y las 4 consultas de referencia (JOIN, subconsulta, GROUP BY/HAVING, vista) contra las que se compara el resultado del estudiante por diferencia de valores — no de texto SQL. Si el temario avanza (transacciones, procedimientos, etc.) y se arma otro examen, este archivo es la plantilla a copiar.
