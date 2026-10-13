# ADR-007: Registro e inicio de sesión de estudiantes mediante JWT

- **Estado:** Implementación inicial en el código; validación de integración pendiente.
- **Fecha:** 2026-10-13.

## Contexto

El sistema original no cuenta con autenticación y expone operaciones de consulta y modificación sin asociarlas a una identidad. El alcance acordado para esta mejora permite que una persona se registre e ingrese únicamente como estudiante; no se habilita el registro público de administradores ni docentes.

## Problema

Sin autenticación, el servidor no puede distinguir qué estudiante está realizando una matrícula ni restringir las operaciones a los datos de su propia cuenta.

## Alternativas consideradas

1. Mantener la aplicación sin login: es simple, pero no identifica al usuario ni permite proteger los recursos personales.
2. Utilizar sesiones de servidor: ofrece gestión de sesión tradicional, pero requiere mantener estado de sesión en el backend.
3. Utilizar JWT firmado en una cookie HttpOnly: permite validar la identidad en middleware y evita que el token sea accesible directamente desde JavaScript del navegador.

## Decisión

Implementar registro e inicio de sesión de estudiantes con contraseñas almacenadas mediante hash bcrypt, tokens JWT firmados con expiración de dos horas y cookie HttpOnly con `SameSite=Strict`. El servidor comprobará la firma, expiración y rol antes de permitir operaciones protegidas. La inscripción pública siempre crea cuentas con rol `ESTUDIANTE`; el rol no se acepta desde el cuerpo enviado por el cliente.

## Justificación

La identidad del estudiante permitirá asociar las matrículas al perfil autenticado, en lugar de confiar en un identificador enviado por el navegador. La cookie HttpOnly reduce la exposición del token a JavaScript, mientras que la firma y la expiración permiten verificar su autenticidad y vigencia. Estas medidas deberán complementarse con HTTPS en producción, validación de entradas, protección contra intentos repetidos y una política adecuada de cookies.

## Consecuencias

- Se agrega una tabla `usuarios` vinculada uno a uno con `estudiantes`.
- Se agregan endpoints de registro, login, consulta de sesión y logout.
- Los estudiantes solo pueden consultar y crear sus propias matrículas.
- No existe registro público de roles privilegiados; la gestión de cursos debe realizarse por semilla SQL o añadirse en una futura versión administrativa.
- Se incorporan dependencias de seguridad y configuración obligatoria de `JWT_SECRET`.
- La expiración del JWT obliga a iniciar sesión nuevamente cada dos horas.
- Al usar cookies, deben mantenerse configurados el origen permitido, `credentials`, `SameSite` y HTTPS en producción; cualquier cambio de despliegue requiere revisar también la protección CSRF.

## Evidencia y validación

Se añadieron las rutas y servicios de autenticación, la tabla `usuarios`, la cookie HttpOnly, el middleware de validación de origen y pruebas unitarias de política de contraseña/correo y origen. Las pruebas de integración de autenticación con PostgreSQL, sesión, logout y matrícula propia siguen pendientes. Por ello, esta decisión no debe presentarse como validada de extremo a extremo hasta ejecutar dichas pruebas.
