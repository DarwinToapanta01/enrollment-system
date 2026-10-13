CREATE TABLE IF NOT EXISTS estudiantes (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL CHECK (char_length(trim(nombre)) BETWEEN 2 AND 120),
  carrera VARCHAR(160) NOT NULL CHECK (char_length(trim(carrera)) BETWEEN 2 AND 160),
  semestre INTEGER NOT NULL CHECK (semestre BETWEEN 1 AND 20),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
  cupos INTEGER NOT NULL CHECK (cupos BETWEEN 1 AND 10000),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matriculas (
  id BIGSERIAL PRIMARY KEY,
  estudiante_id BIGINT NOT NULL REFERENCES estudiantes(id) ON DELETE RESTRICT,
  curso_id BIGINT NOT NULL REFERENCES cursos(id) ON DELETE RESTRICT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_matricula_estudiante_curso UNIQUE (estudiante_id, curso_id)
);

CREATE INDEX IF NOT EXISTS idx_matriculas_estudiante ON matriculas(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_curso ON matriculas(curso_id);
