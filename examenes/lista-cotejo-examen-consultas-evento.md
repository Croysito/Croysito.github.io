# Lista de cotejo — Examen de consultas en vivo (Encuentro de Promociones)

Archivo del examen: `examen-consultas-evento.html`. **Corrección manual:** cada estudiante usa su propio modelo (nombres de tablas y columnas distintos), así que el motor no compara resultados. Solo exige que cada consulta ejecute sin error y que el estudiante la entregue. Marcas tú cada indicador revisando el SQL entregado, que llega a ATENZA como texto libre por pregunta.

Los pasos 1 y 2 (DDL y DML) son una compuerta del examen, no puntúan. Total: 20 indicadores × 5 pts = **100 pts**.

## Reporte 1. Participantes por campo, colegio y tipo de participante · `r1`

| N.º | Indicador | Pts | Sí | No |
|---|---|---|---|---|
| 1.1 | Une correctamente al participante con su colegio y su campo de misión | 5 | | |
| 1.2 | Muestra nombre, apellido y talla de polera | 5 | | |
| 1.3 | Distingue correctamente entre estudiante y encargado o acompañante | 5 | | |
| 1.4 | Agrupa en el orden pedido (campo, colegio, tipo) y ordena por apellido | 5 | | |
| 1.5 | Considera solo los participantes de la edición activa | 5 | | |

## Reporte 2. Pagos y subvención de acompañantes por colegio · `r2`

| N.º | Indicador | Pts | Sí | No |
|---|---|---|---|---|
| 2.1 | Cuenta solo a los estudiantes con pago aprobado y cuenta correctamente el total de acompañantes por colegio | 5 | | |
| 2.2 | Calcula los acompañantes que están bajo regla | 5 | | |
| 2.3 | Calcula los acompañantes que deben pagar sin dar valores negativos | 5 | | |
| 2.4 | Suma el monto de los comprobantes aprobados sin duplicarlo al unir tablas | 5 | | |
| 2.5 | Ordena por campo de misión y por estudiantes pagados de mayor a menor | 5 | | |

## Reporte 3. Inscritos por disciplina y cumplimiento de cupos · `r3`

| N.º | Indicador | Pts | Sí | No |
|---|---|---|---|---|
| 3.1 | Une correctamente área, disciplina, inscripción, participante y colegio | 5 | | |
| 3.2 | Cuenta los inscritos por disciplina y por colegio | 5 | | |
| 3.3 | La columna «Estado» muestra correctamente los tres valores pedidos | 5 | | |
| 3.4 | Si una disciplina no tiene un cupo definido, no aplica ese límite y no marca un estado incorrecto | 5 | | |
| 3.5 | Muestra solo los colegios con al menos un inscrito y ordena por área, disciplina y colegio | 5 | | |

## Reporte 4. Estudiantes activos sin disciplina asignada · `r4a` (detalle) y `r4b` (conteo)

| N.º | Indicador | Pts | Sí | No |
|---|---|---|---|---|
| 4.1 | Considera solo a los estudiantes con pago aprobado, sin incluir acompañantes | 5 | | |
| 4.2 | Identifica correctamente a los estudiantes que no tienen ninguna inscripción en disciplinas | 5 | | |
| 4.3 | Muestra todas las columnas pedidas, incluido el lote o comprobante | 5 | | |
| 4.4 | Agrupa los resultados por campo de misión y colegio | 5 | | |
| 4.5 | La segunda consulta cuenta correctamente cuántos estudiantes de cada colegio están en esta situación | 5 | | |

Indicadores 4.1 a 4.4 se miran en `r4a`; el 4.5 en `r4b` (el 4.1 y 4.2 también deben cumplirse ahí).

## Dónde se suele fallar (para marcar con criterio)

- **2.4 — monto duplicado:** al unir participantes con comprobantes y sumar el monto en la misma consulta, un comprobante se repite por cada estudiante y el total sale inflado. Se resuelve con subconsultas o CTE separadas por métrica.
- **2.1 — colegio que desaparece:** un colegio sin estudiantes activos se pierde por usar `INNER JOIN` donde hacía falta `LEFT JOIN`.
- **2.2 y 2.3:** la subvención debe salir de la regla configurada en la edición, no de un `25` escrito en el SQL, y acotarse al total de acompañantes (`LEAST` o `CASE`); si no, "deben pagar" sale negativo.
- **3.3 y 3.4 — cupos `NULL`:** comparar contra un cupo `NULL` da `NULL` (no falso) y el caso cae en el `ELSE`. Hay que verificar `cupo IS NOT NULL` antes de comparar.
- **4.2 — `NOT IN` con `NULL`:** devuelve cero filas en silencio si la subconsulta puede traer `NULL`. `NOT EXISTS` y `LEFT JOIN ... IS NULL` no tienen el problema.
- **1.5:** depende de que su modelo tenga una tabla o columna de edición; si no la tiene, no aplica y puedes dar el punto.

## Soluciones de referencia

Probadas contra PostgreSQL real (`@electric-sql/pglite`) sobre un esquema de ejemplo: `mision`, `colegio`, `participante(tipo)`, `comprobante(estado)`, `matricula`, `edicion(proporcion_subvencion)`, `area`, `disciplina(cupo_min, cupo_max)`, `inscripcion_disciplina`. **Los nombres de tus estudiantes serán otros**, y el ejemplo no filtra por edición activa (1.5): úsalas para comparar la lógica, no el texto.

```sql
-- Reporte 1
SELECT m.nombre AS campo, c.nombre AS colegio, p.tipo, p.apellido, p.nombre, p.talla_polera
FROM participante p
JOIN colegio c ON c.id = p.colegio_id
JOIN mision m ON m.id = c.mision_id
ORDER BY m.nombre, c.nombre, p.tipo, p.apellido;

-- Reporte 2
SELECT m.nombre AS campo, c.nombre AS colegio,
       est.activos AS estudiantes_activos,
       aco.total AS acompanantes,
       LEAST(aco.total, est.activos / e.proporcion_subvencion) AS subvencionados,
       aco.total - LEAST(aco.total, est.activos / e.proporcion_subvencion) AS deben_pagar,
       COALESCE(pg.monto, 0) AS monto_aprobado
FROM colegio c
JOIN mision m ON m.id = c.mision_id
CROSS JOIN (SELECT proporcion_subvencion FROM edicion LIMIT 1) e
LEFT JOIN LATERAL (SELECT COUNT(*) AS activos FROM participante p
    JOIN matricula ma ON ma.participante_id = p.id
    JOIN comprobante cp ON cp.id = ma.comprobante_id
    WHERE p.colegio_id = c.id AND p.tipo = 'estudiante' AND cp.estado = 'aprobado') est ON true
LEFT JOIN LATERAL (SELECT COUNT(*) AS total FROM participante p
    WHERE p.colegio_id = c.id AND p.tipo = 'acompanante') aco ON true
LEFT JOIN LATERAL (SELECT SUM(monto) AS monto FROM comprobante cp
    WHERE cp.colegio_id = c.id AND cp.estado = 'aprobado') pg ON true
ORDER BY m.nombre, est.activos DESC;

-- Reporte 3
SELECT a.nombre AS area, d.nombre AS disciplina, d.modalidad, c.nombre AS colegio,
       COUNT(*) AS inscritos, d.cupo_min, d.cupo_max,
       CASE WHEN d.cupo_min IS NOT NULL AND COUNT(*) < d.cupo_min THEN 'No alcanza el mínimo'
            WHEN d.cupo_max IS NOT NULL AND COUNT(*) > d.cupo_max THEN 'Excede el máximo'
            ELSE 'Habilitado' END AS "Estado"
FROM inscripcion_disciplina idi
JOIN disciplina d ON d.id = idi.disciplina_id
JOIN area a ON a.id = d.area_id
JOIN participante p ON p.id = idi.participante_id
JOIN colegio c ON c.id = p.colegio_id
GROUP BY a.nombre, d.id, d.nombre, d.modalidad, c.id, c.nombre, d.cupo_min, d.cupo_max
ORDER BY a.nombre, d.nombre, c.nombre;

-- Reporte 4, parte 1
SELECT m.nombre AS campo, c.nombre AS colegio, p.apellido, p.nombre, p.curso, cp.id AS comprobante
FROM participante p
JOIN colegio c ON c.id = p.colegio_id
JOIN mision m ON m.id = c.mision_id
JOIN matricula ma ON ma.participante_id = p.id
JOIN comprobante cp ON cp.id = ma.comprobante_id
WHERE p.tipo = 'estudiante' AND cp.estado = 'aprobado'
  AND NOT EXISTS (SELECT 1 FROM inscripcion_disciplina idi WHERE idi.participante_id = p.id)
ORDER BY m.nombre, c.nombre, p.apellido;

-- Reporte 4, parte 2
SELECT c.nombre AS colegio, COUNT(*) AS sin_disciplina
FROM participante p
JOIN colegio c ON c.id = p.colegio_id
JOIN matricula ma ON ma.participante_id = p.id
JOIN comprobante cp ON cp.id = ma.comprobante_id
WHERE p.tipo = 'estudiante' AND cp.estado = 'aprobado'
  AND p.id NOT IN (SELECT participante_id FROM inscripcion_disciplina)
GROUP BY c.id, c.nombre
ORDER BY c.nombre;
```

## Cómo se administra el examen

1. **En ATENZA:** crea la `Clase`, vincula la guía con el link `https://guias.atenzabo.com/examenes/examen-consultas-evento.html` y carga el manifest con estos 7 `data-quiz-id`: `ddl`, `dml`, `r1`, `r2`, `r3`, `r4a`, `r4b`. Lánzalo en vivo a la clase. La página reconoce el lanzamiento por `?atenza_token=...&guia_intento=...`.
2. **Sin ATENZA no hay control de foco.** Si abres el link directo, la pantalla de inicio avisa "Sin supervisión de ATENZA". Para probar la pantalla completa y los avisos sin lanzar una clase, abre `examen-consultas-evento.html?prueba=1`: simula la supervisión y anota en la consola (F12) lo que enviaría a ATENZA, sin enviar nada. Usa un nombre distinto en cada prueba o borra el `localStorage`, porque el cronómetro queda guardado por nombre.
3. **Qué reporta a ATENZA:** cada paso aprobado o entregado como `texto_libre` con el SQL del estudiante (si corrigen el DDL o el DML durante los reportes, se reenvía la versión nueva); incidentes (`visibilitychange`, `blur`, `salida_pantalla_completa`) **desde que presionan «Comenzar»**; y `finalizar` al entregar el Reporte 4 parte 2 o al agotarse el tiempo. Al agotarse el tiempo también se envían los borradores sin entregar.
4. **Dos partes:** la **Parte 1** (pasos 1 y 2, DDL y DML; los dos están habilitados desde que se pone el nombre y se pueden verificar en cualquier orden) no tiene cronómetro ni control de foco, para que el estudiante pueda traer su código desde otra ventana. Al final hay un botón **«Comenzar»**, habilitado solo con ambos pasos verificados y con confirmación de doble toque. Al presionarlo arrancan las 2 horas, el examen pasa a pantalla completa (si el navegador lo rechaza, aparece una barra roja con botón para entrar) y se habilita la **Parte 2** (los 4 reportes). Los pasos 1 y 2 siguen editables durante los reportes: si el estudiante corrige el DDL, el DML ya aprobado se vuelve a cargar solo. Cada salida a copiar código desde otra ventana queda registrada como incidente.
5. **Un mismo cambio de pestaña cuenta un solo incidente** (se descartan los eventos dentro de 1,5 s del anterior). En las guías nativas, `visibilitychange` y `blur` se cuentan por separado y duplican.
6. **Recarga o cierre de pestaña:** el cronómetro (si ya presionó «Comenzar») sigue corriendo y el progreso queda guardado. Con ATENZA el estado se amarra al intento, no al nombre. Al reingresar, la base se reconstruye sola a partir del DDL y DML ya aprobados.
7. **Falso negativo de los pasos 1 o 2:** cada paso bloqueado tiene un botón "🔑 Clave del profesor" (por defecto `bd2-2026-roy`; cámbiala en `CLAVE_PROFESOR`). Solo destraba el paso inmediato siguiente y deja constancia "(clave del profesor)" en el certificado. No reporta nada a ATENZA por ese paso.
8. **Qué exige el motor al DDL y DML** (constantes al inicio del `<script>`): al menos 5 tablas, todas con `PRIMARY KEY`, al menos 3 `FOREIGN KEY`; y datos en al menos 5 tablas con 20 filas en total. Si un modelo legítimo queda por debajo, baja `MIN_*` o usa la clave.
9. **Limitaciones de PGlite:** no soporta extensiones como `uuid-ossp` ni comandos de `psql` (`\c`, `\i`). Si el DDL de un estudiante los usa, falla con el error real de Postgres; avísales de quitarlos antes del examen.
