INSERT INTO estudiantes (id, nombre, carrera, semestre)
VALUES
  (1, 'Ana Torres', 'Ingeniería de Software', 8),
  (2, 'Luis Pérez', 'Ingeniería de Software', 8),
  (3, 'María Gómez', 'Tecnologías de la Información', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cursos (id, nombre, docente, cupos)
VALUES
  (1, 'Arquitectura de Software', 'Ing. Carlos Ruiz', 30),
  (2, 'Bases de Datos', 'Ing. Laura Vera', 25),
  (3, 'Desarrollo Web', 'Ing. Pedro León', 35)
ON CONFLICT (id) DO NOTHING;

INSERT INTO matriculas (id, estudiante_id, curso_id)
VALUES (1, 1, 1), (2, 2, 1), (3, 1, 2)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('estudiantes', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM estudiantes), 1), 1));
SELECT setval(pg_get_serial_sequence('cursos', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM cursos), 1), 1));
SELECT setval(pg_get_serial_sequence('matriculas', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM matriculas), 1), 1));
