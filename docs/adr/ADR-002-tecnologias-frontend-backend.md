# ADR-002: React y Tailwind CSS para el frontend; Node.js y Express para el backend

- **Estado:** Implementado en el código; compilación del frontend pendiente de ejecutar en un entorno con dependencias instaladas.
- **Fecha:** 2026-10-13

## Contexto
La interfaz original utilizaba HTML, CSS y JavaScript con manipulación directa del DOM. El backend ya utilizaba Node.js y Express.

## Alternativas consideradas
1. Mantener HTML, CSS y JavaScript sin framework.
2. Adoptar React y Tailwind CSS para el frontend y conservar Node.js/Express para el backend.
3. Migrar el servidor a otro lenguaje o framework.

## Decisión
Se seleccionó React con Vite y Tailwind CSS para la interfaz. Node.js y Express se mantienen para la API del servidor.

## Justificación
React permite estructurar la interfaz mediante componentes reutilizables; Tailwind CSS permite definir estilos mediante clases de utilidad. Conservar Express reduce el alcance de la migración del servidor y permite concentrarse en la separación de responsabilidades.

## Consecuencias
- Positivas: componentes de interfaz reutilizables y separación clara entre cliente y servidor.
- Negativas: aumento de dependencias y necesidad de mantener un proceso de compilación del frontend.
- Riesgo: la adopción de React no garantiza por sí sola mejor rendimiento; debe evaluarse mediante pruebas.

## Evidencia
`frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/vite.config.js` y `backend/src/app.js`.
