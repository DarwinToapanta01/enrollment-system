# ADR-001: Adoptar una arquitectura monolítica en capas

- **Estado:** Implementada en el código; validación funcional completa pendiente de PostgreSQL.
- **Fecha:** 2026-10-13

## Contexto
El `server.js` original concentraba datos en memoria, rutas HTTP, reglas de matrícula y consultas entre estudiantes y cursos. Esto dificultaba separar y probar responsabilidades.

## Alternativas consideradas
1. Mantener el archivo monolítico sin capas.
2. Conservar un sistema monolítico y separar rutas, controladores, servicios y repositorios.
3. Dividir el sistema en microservicios independientes.

## Decisión
Se mantiene un sistema monolítico integrado y se organiza el backend en rutas, controladores, servicios, repositorios y middleware. El frontend React se encuentra en un proyecto separado dentro del mismo repositorio.

## Justificación
La separación por capas responde al problema observado y coincide con el enfoque de arquitectura en capas explicado en la presentación de la Unidad 1. Microservicios añadirían complejidad operativa que no está justificada por el tamaño y alcance actual.

## Consecuencias
- Positivas: responsabilidades más delimitadas, mejor organización y mayor facilidad para probar módulos.
- Negativas: más archivos y necesidad de mantener contratos claros entre capas.
- Limitación: el sistema continúa desplegándose como una solución integrada; no se escala cada capa por separado.

## Evidencia
`backend/src/routes/`, `backend/src/controllers/`, `backend/src/services/`, `backend/src/repositories/` y `backend/src/middleware/`.
