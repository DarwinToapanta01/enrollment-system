# ADR-003: Comunicación cliente-servidor mediante API REST

- **Estado:** Implementada en el código; prueba end-to-end pendiente de configuración de PostgreSQL.
- **Fecha:** 2026-10-13

## Contexto
La interfaz necesita consultar y modificar estudiantes, cursos y matrículas. La aplicación original ya exponía endpoints HTTP con respuestas JSON.

## Alternativas consideradas
1. Continuar sirviendo interfaz y API desde el mismo servidor.
2. Separar frontend y backend y comunicarlos mediante HTTP/JSON con una API REST.
3. Incorporar eventos o mensajería.

## Decisión
El frontend Vite/React consume los endpoints REST de Express mediante solicitudes HTTP y respuestas JSON. Durante desarrollo, Vite redirige `/api` al servidor local.

## Justificación
Las operaciones CRUD del sistema se adaptan a HTTP/JSON. No se identificó una necesidad de comunicación asíncrona distribuida que justifique mensajería.

## Consecuencias
- Positivas: interfaz y backend pueden evolucionar con responsabilidades separadas y la API puede ser reutilizada por otros clientes.
- Negativas: se deben gestionar errores HTTP, configuración CORS y la URL de API según el entorno.

## Evidencia
`frontend/src/App.jsx`, `frontend/vite.config.js` y `backend/src/app.js`.
