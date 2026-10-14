CREATE TABLE IF NOT EXISTS estudiantes (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL CHECK (char_length(trim(nombre)) BETWEEN 2 AND 120),
  carrera VARCHAR(160) NOT NULL CHECK (char_length(trim(carrera)) BETWEEN 2 AND 160),
  semestre INTEGER NOT NULL CHECK (semestre BETWEEN 1 AND 20),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Normalize the career rule from earlier database versions with the API rule.
ALTER TABLE estudiantes DROP CONSTRAINT IF EXISTS chk_carrera_valida;
ALTER TABLE estudiantes DROP CONSTRAINT IF EXISTS estudiantes_carrera_check;
UPDATE estudiantes
SET carrera = CASE carrera
  WHEN 'BSc in Information Technology' THEN U&'Ing en Tecnolog\00EDas de la Informaci\00F3n'
  WHEN 'BSc in Software Engineering' THEN 'Ing en Software'
  WHEN 'BSc in Biotechnology' THEN U&'Ing en Biotecnolog\00EDa'
  ELSE carrera
END;
ALTER TABLE estudiantes ADD CONSTRAINT estudiantes_carrera_check CHECK (
  carrera IN (
    U&'Ing en Tecnolog\00EDas de la Informaci\00F3n',
    'Ing en Software',
    U&'Ing en Biotecnolog\00EDa'
  )
);

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  estudiante_id BIGINT NOT NULL UNIQUE REFERENCES estudiantes(id) ON DELETE CASCADE,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'ESTUDIANTE' CHECK (rol = 'ESTUDIANTE'),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT email_format CHECK (email = lower(trim(email)) AND position('@' in email) > 1)
);

CREATE TABLE IF NOT EXISTS cursos (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL CHECK (char_length(trim(nombre)) BETWEEN 2 AND 160),
  docente VARCHAR(120) NOT NULL CHECK (char_length(trim(docente)) BETWEEN 2 AND 120),
  carrera VARCHAR(160) NOT NULL DEFAULT 'Ing en Software',
  semestre INTEGER NOT NULL DEFAULT 9 CHECK (semestre BETWEEN 1 AND 9),
  cupos INTEGER NOT NULL CHECK (cupos BETWEEN 1 AND 10000),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compatibility migration for databases created with the previous schema.
-- The existing catalog belongs to ninth semester.
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS semestre INTEGER NOT NULL DEFAULT 9;
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS carrera VARCHAR(160) NOT NULL DEFAULT 'Ing en Software';
UPDATE cursos SET semestre = 9 WHERE semestre IS NULL;
UPDATE cursos SET carrera = 'Ing en Software' WHERE carrera IS NULL;
ALTER TABLE cursos ALTER COLUMN semestre SET NOT NULL;
ALTER TABLE cursos ALTER COLUMN carrera SET NOT NULL;
ALTER TABLE cursos DROP CONSTRAINT IF EXISTS cursos_semestre_check;
ALTER TABLE cursos ADD CONSTRAINT cursos_semestre_check CHECK (semestre BETWEEN 1 AND 9);
ALTER TABLE cursos DROP CONSTRAINT IF EXISTS cursos_carrera_check;
ALTER TABLE cursos ADD CONSTRAINT cursos_carrera_check CHECK (
  carrera IN (
    U&'Ing en Tecnolog\00EDas de la Informaci\00F3n',
    'Ing en Software',
    U&'Ing en Biotecnolog\00EDa'
  )
);
ALTER TABLE cursos DROP CONSTRAINT IF EXISTS uq_curso_carrera_semestre_nombre;
ALTER TABLE cursos ADD CONSTRAINT uq_curso_carrera_semestre_nombre UNIQUE (carrera, semestre, nombre);

CREATE TABLE IF NOT EXISTS matriculas (
  id BIGSERIAL PRIMARY KEY,
  estudiante_id BIGINT NOT NULL REFERENCES estudiantes(id) ON DELETE RESTRICT,
  curso_id BIGINT NOT NULL REFERENCES cursos(id) ON DELETE RESTRICT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_matricula_estudiante_curso UNIQUE (estudiante_id, curso_id)
);

CREATE INDEX IF NOT EXISTS idx_matriculas_estudiante ON matriculas(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_curso ON matriculas(curso_id);
CREATE INDEX IF NOT EXISTS idx_cursos_semestre ON cursos(semestre);
CREATE INDEX IF NOT EXISTS idx_cursos_carrera_semestre ON cursos(carrera, semestre);
