# ADR-005: Despliegue integrado con un backend Node.js y una base de datos relacional

- **Estado:** Propuesta de despliegue; no se ha desplegado en un entorno externo.
- **Fecha:** 2026-10-13

## Contexto
El proyecto es una aplicación académica pequeña y no se ha demostrado que requiera despliegues independientes ni escalado autónomo por componente.

## Alternativas consideradas
1. Ejecutar el backend en un servidor Node.js y PostgreSQL como servicio de base de datos.
2. Empaquetar componentes mediante contenedores.
3. Desplegar servicios independientes.

## Decisión
Mantener un backend integrado de Node.js/Express y PostgreSQL como servicio de persistencia. El frontend se construye por separado; la estrategia concreta de hosting podrá ajustarse al entorno disponible.

## Justificación
Reduce la complejidad operativa y es suficiente para validar la arquitectura en capas. La presentación advierte que una arquitectura distribuida agrega complejidad de comunicación y monitoreo.

## Consecuencias
- Positivas: configuración y mantenimiento inicial más sencillos.
- Negativas: despliegue del backend como una unidad y dependencia de la disponibilidad de PostgreSQL.
- Estado pendiente: decidir hosting y validar configuración de producción.
