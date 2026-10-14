-- Base academic catalog: three subjects for every career and semester.
-- Teachers can be replaced later by the academic administration.

INSERT INTO cursos (nombre, docente, carrera, semestre, cupos)
SELECT c.nombre, c.docente, 'Ing en Software', c.semestre, 30
FROM (VALUES
  (1, 'Programming Fundamentals', 'Docente por asignar'),
  (1, 'Mathematics I', 'Docente por asignar'),
  (1, 'University Skills', 'Docente por asignar'),
  (2, 'Object-Oriented Programming', 'Docente por asignar'),
  (2, 'Mathematics II', 'Docente por asignar'),
  (2, 'Discrete Mathematics', 'Docente por asignar'),
  (3, 'Data Structures', 'Docente por asignar'),
  (3, 'Database Fundamentals', 'Docente por asignar'),
  (3, 'Computer Organization', 'Docente por asignar'),
  (4, 'Algorithms', 'Docente por asignar'),
  (4, 'Relational Databases', 'Docente por asignar'),
  (4, 'Operating Systems', 'Docente por asignar'),
  (5, 'Software Engineering', 'Docente por asignar'),
  (5, 'Computer Networks', 'Docente por asignar'),
  (5, 'Web Development', 'Docente por asignar'),
  (6, 'Advanced Databases', 'Docente por asignar'),
  (6, 'Mobile Development', 'Docente por asignar'),
  (6, 'Software Testing', 'Docente por asignar'),
  (7, 'Cloud Computing', 'Docente por asignar'),
  (7, 'Information Security', 'Docente por asignar'),
  (7, 'Human Computer Interaction', 'Docente por asignar'),
  (8, 'Distributed Systems', 'Docente por asignar'),
  (8, 'DevOps', 'Docente por asignar'),
  (8, 'Software Project Management', 'Docente por asignar'),
  (9, 'Software Architecture', 'Ing. Jair Chuquitarco'),
  (9, 'Database Systems', 'Ing. Cristian Coronel'),
  (9, 'Web Development', 'Ing. Pablo Puente')
) AS c(semestre, nombre, docente)
ON CONFLICT (carrera, semestre, nombre) DO UPDATE
SET docente = EXCLUDED.docente, cupos = EXCLUDED.cupos;

INSERT INTO cursos (nombre, docente, carrera, semestre, cupos)
SELECT c.nombre, c.docente, U&'Ing en Tecnolog\00EDas de la Informaci\00F3n', c.semestre, 30
FROM (VALUES
  (1, 'Computing Fundamentals', 'Docente por asignar'),
  (1, 'Mathematics I', 'Docente por asignar'),
  (1, 'Communication Skills', 'Docente por asignar'),
  (2, 'Programming I', 'Docente por asignar'),
  (2, 'Mathematics II', 'Docente por asignar'),
  (2, 'Logical Reasoning', 'Docente por asignar'),
  (3, 'Programming II', 'Docente por asignar'),
  (3, 'Data Management', 'Docente por asignar'),
  (3, 'Computer Networks I', 'Docente por asignar'),
  (4, 'Web Technologies', 'Docente por asignar'),
  (4, 'Database Administration', 'Docente por asignar'),
  (4, 'Systems Analysis', 'Docente por asignar'),
  (5, 'Enterprise Applications', 'Docente por asignar'),
  (5, 'Computer Networks II', 'Docente por asignar'),
  (5, 'IT Service Management', 'Docente por asignar'),
  (6, 'Cybersecurity Fundamentals', 'Docente por asignar'),
  (6, 'Cloud Infrastructure', 'Docente por asignar'),
  (6, 'Business Intelligence', 'Docente por asignar'),
  (7, 'Systems Integration', 'Docente por asignar'),
  (7, 'IT Governance', 'Docente por asignar'),
  (7, 'Data Analytics', 'Docente por asignar'),
  (8, 'Digital Transformation', 'Docente por asignar'),
  (8, 'IT Audit', 'Docente por asignar'),
  (8, 'Technology Project Management', 'Docente por asignar'),
  (9, 'IT Architecture', 'Docente por asignar'),
  (9, 'Advanced Cybersecurity', 'Docente por asignar'),
  (9, 'Technology Innovation', 'Docente por asignar')
) AS c(semestre, nombre, docente)
ON CONFLICT (carrera, semestre, nombre) DO UPDATE
SET docente = EXCLUDED.docente, cupos = EXCLUDED.cupos;

INSERT INTO cursos (nombre, docente, carrera, semestre, cupos)
SELECT c.nombre, c.docente, U&'Ing en Biotecnolog\00EDa', c.semestre, 30
FROM (VALUES
  (1, 'General Biology', 'Docente por asignar'),
  (1, 'General Chemistry', 'Docente por asignar'),
  (1, 'Mathematics I', 'Docente por asignar'),
  (2, 'Cell Biology', 'Docente por asignar'),
  (2, 'Organic Chemistry', 'Docente por asignar'),
  (2, 'Mathematics II', 'Docente por asignar'),
  (3, 'Genetics', 'Docente por asignar'),
  (3, 'Biochemistry', 'Docente por asignar'),
  (3, 'Physics for Biotechnology', 'Docente por asignar'),
  (4, 'Microbiology', 'Docente por asignar'),
  (4, 'Molecular Biology', 'Docente por asignar'),
  (4, 'Statistics', 'Docente por asignar'),
  (5, 'Immunology', 'Docente por asignar'),
  (5, 'Bioinformatics', 'Docente por asignar'),
  (5, 'Bioprocess Engineering', 'Docente por asignar'),
  (6, 'Genetic Engineering', 'Docente por asignar'),
  (6, 'Industrial Biotechnology', 'Docente por asignar'),
  (6, 'Biostatistics', 'Docente por asignar'),
  (7, 'Plant Biotechnology', 'Docente por asignar'),
  (7, 'Environmental Biotechnology', 'Docente por asignar'),
  (7, 'Bioreactor Design', 'Docente por asignar'),
  (8, 'Pharmaceutical Biotechnology', 'Docente por asignar'),
  (8, 'Food Biotechnology', 'Docente por asignar'),
  (8, 'Research Methodology', 'Docente por asignar'),
  (9, 'Advanced Bioprocesses', 'Docente por asignar'),
  (9, 'Biotechnology Innovation', 'Docente por asignar'),
  (9, 'Degree Project', 'Docente por asignar')
) AS c(semestre, nombre, docente)
ON CONFLICT (carrera, semestre, nombre) DO UPDATE
SET docente = EXCLUDED.docente, cupos = EXCLUDED.cupos;
