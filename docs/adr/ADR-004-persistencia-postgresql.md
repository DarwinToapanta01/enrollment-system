# ADR-004: Persistir los datos en PostgreSQL

- **Estado:** Implementada en el código y scripts SQL; ejecución contra un servidor PostgreSQL pendiente.
- **Fecha:** 2026-10-13

## Contexto
La versión original guardaba estudiantes, cursos y matrículas en arreglos de memoria, por lo que los datos se perdían al reiniciar el servidor.

## Alternativas consideradas
1. Mantener arreglos en memoria.
2. Usar una base de datos relacional como PostgreSQL.
3. Usar una base de datos NoSQL.

## Decisión
Usar PostgreSQL con tablas relacionales, claves foráneas, restricciones y consultas parametrizadas.

## Justificación
Estudiantes, cursos y matrículas poseen relaciones explícitas. PostgreSQL permite representar esas relaciones, aplicar integridad referencial y conservar los registros entre ejecuciones.

## Consecuencias
- Positivas: persistencia y restricciones relacionales administradas por el motor.
- Negativas: requiere configurar el servidor, credenciales, esquema y respaldos.
- Riesgo: el backend no inicia si falta `DATABASE_URL` o la base de datos no está disponible.

## Evidencia
`backend/sql/schema.sql`, `backend/sql/seed.sql`, `backend/src/config/database.js` y `backend/src/repositories/`.
