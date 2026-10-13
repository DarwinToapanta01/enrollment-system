# ADR-006: Centralizar validaciones y manejo de errores

- **Estado:** Implementada parcialmente en el código; se requiere ampliar las pruebas funcionales.
- **Fecha:** 2026-10-13

## Contexto
Las rutas originales aceptaban campos sin comprobar integralmente sus tipos y rangos, y no había un manejo centralizado de errores.

## Alternativas consideradas
1. Mantener comprobaciones dispersas dentro de cada ruta.
2. Incorporar validaciones reutilizables y middleware de errores.
3. Añadir autenticación y autorización completas además de las validaciones.

## Decisión
Crear utilidades de validación reutilizables, middleware centralizado de errores, límites de tamaño para JSON y consultas parametrizadas. La autenticación y autorización no se incorporan en esta iteración porque el requisito no define cuentas ni roles; deben evaluarse si el sistema pasa a uso real.

## Justificación
Las validaciones permiten rechazar datos inválidos, el middleware unifica las respuestas de error y las consultas parametrizadas reducen el riesgo de inyección SQL.

## Consecuencias
- Positivas: respuestas más consistentes y reglas de validación centralizadas.
- Negativas: las reglas deben mantenerse sincronizadas con las restricciones de la base de datos.
- Limitación: la validación no reemplaza autenticación ni autorización.

## Evidencia
`backend/src/utils/validation.js`, `backend/src/middleware/errorHandler.js`, `backend/src/middleware/notFound.js` y `backend/test/validation.test.js`.
