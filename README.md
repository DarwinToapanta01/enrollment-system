# Sistema de Matrícula Universitaria — Arquitectura en capas

Proyecto académico de mejora arquitectónica del repositorio proporcionado por el docente. La solución mantiene un backend monolítico con Node.js y Express, organizado en rutas, controladores, servicios y repositorios. El frontend utiliza React, Vite y Tailwind CSS; PostgreSQL almacena estudiantes, cuentas, cursos y matrículas.

## Tecnologías

- **Frontend:** React, Vite, Tailwind CSS.
- **Backend:** Node.js, Express, JavaScript.
- **Comunicación:** API REST sobre HTTP/JSON.
- **Datos:** PostgreSQL y consultas parametrizadas mediante `pg`.
- **Autenticación:** JWT firmado, cookie `HttpOnly`, hash de contraseña con bcryptjs.
- **Protecciones adicionales:** Helmet, limitación de intentos en endpoints de autenticación, CORS configurado y middleware de autenticación.
- **Pruebas:** Node.js test runner.

## Alcance de cuentas

La aplicación permite crear cuentas únicamente con el rol `ESTUDIANTE`. El registro crea el perfil académico y la cuenta de acceso en una transacción. Los estudiantes pueden consultar cursos y gestionar sus propias matrículas. La administración de cursos no se expone a cuentas de estudiante; los cursos iniciales se cargan mediante `backend/sql/seed.sql`.

La cookie JWT se configura como `HttpOnly` y `SameSite=Strict`. En producción debe usarse HTTPS, un `JWT_SECRET` aleatorio y suficientemente largo, y debe revisarse la estrategia de protección CSRF y CORS conforme al dominio final.

## Requisitos

- Node.js 20 o superior.
- npm.
- PostgreSQL 14 o superior.

## Configuración de PostgreSQL

1. Crear la base de datos:

   ```sql
   CREATE DATABASE matricula_universitaria;
   ```

2. Aplicar esquema y datos iniciales:

   ```bash
   psql -U postgres -d matricula_universitaria -f backend/sql/schema.sql
   psql -U postgres -d matricula_universitaria -f backend/sql/seed.sql
   ```

3. Copiar `backend/.env.example` a `backend/.env` y configurar `DATABASE_URL`, `JWT_SECRET`, `PORT` y `FRONTEND_ORIGIN`. No subir `.env` a GitHub.

## Instalación y ejecución

Desde la raíz:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
npm run dev
```

Frontend: `http://localhost:5173`  
API: `http://localhost:3000/api/health`

## Endpoints

- `GET /api/health`
- `POST /api/auth/register` — crea una cuenta de estudiante.
- `POST /api/auth/login` — inicia sesión.
- `GET /api/auth/me` — obtiene la cuenta autenticada.
- `POST /api/auth/logout` — cierra sesión.
- `GET /api/cursos` — consulta el catálogo.
- `GET /api/matriculas/mis-matriculas` — consulta las matrículas del estudiante autenticado.
- `POST /api/matriculas` — crea una matrícula para el estudiante autenticado; el cliente solo envía `cursoId`.

## Pruebas

```bash
npm test
```

Las pruebas unitarias cubren validaciones generales, política básica de contraseña/correo y comprobación de origen. Las pruebas de integración con PostgreSQL y los flujos HTTP de autenticación deben ejecutarse antes de afirmar que el sistema completo funciona correctamente.

## Decisiones de arquitectura

Los registros RDA/ADR se encuentran en `docs/adr/`. El estado de cada decisión debe actualizarse solo después de verificar la implementación y registrar los resultados de pruebas reales.
