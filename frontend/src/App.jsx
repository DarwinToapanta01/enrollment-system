import { useCallback, useEffect, useState } from 'react';

const CARRERAS_PERMITIDAS = [
  'Ing en Tecnologías de la Información',
  'Ing en Software',
  'Ing en Biotecnología',
];

const SEMESTRES_PERMITIDOS = Array.from(
  { length: 9 },
  (_, index) => index + 1
);

async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    credentials: 'include',
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  });
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `La solicitud falló (${response.status}).`);
  return data;
}

const blankLogin = { email: '', password: '' };
const blankRegister = { nombre: '', carrera: '', semestre: '1', email: '', password: '' };

function Field({ label, value, onChange, type = 'text', min, max, placeholder, autoComplete }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        value={value}
        onChange={onChange}
        type={type}
        min={min}
        max={max}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
    </div>
  );
}

function Notice({ notice, onClose }) {
  if (!notice.text) return null;
  return (
    <div role="status" className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-sm shadow-sm ${notice.type === 'error' ? 'border-rose-200 bg-rose-50/80 text-rose-800' : 'border-emerald-200 bg-emerald-50/80 text-emerald-800'}`}>
      <span className="font-medium">{notice.text}</span>
      <button aria-label="Cerrar aviso" onClick={onClose} className="rounded-lg p-1 text-lg font-bold hover:bg-black/5">×</button>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [loginForm, setLoginForm] = useState(blankLogin);
  const [registerForm, setRegisterForm] = useState(blankRegister);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('cursos'); // 'cursos' o 'mis-matriculas'

  const loadDashboard = useCallback(async () => {
    try {
      const [courseData, enrollmentData] = await Promise.all([
        api('/cursos'),
        api('/matriculas/mis-matriculas'),
      ]);
      setCourses(courseData);
      setEnrollments(enrollmentData);
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    }
  }, []);

  useEffect(() => {
    let active = true;
    api('/auth/me').then((currentUser) => {
      if (active) setUser(currentUser);
    }).catch(() => {
      if (active) setUser(null);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (user) loadDashboard();
  }, [user, loadDashboard]);

  async function submitAuth(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (authMode === 'login') {
        const result = await api('/auth/login', { method: 'POST', body: JSON.stringify(loginForm) });
        setUser(result.user);
        setNotice({ type: 'success', text: '¡Bienvenido de nuevo al sistema!' });
        setLoginForm(blankLogin);
      } else {
        const result = await api('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ ...registerForm, semestre: Number(registerForm.semestre) }),
        });
        setUser(result.user);
        setNotice({ type: 'success', text: 'Cuenta creada con éxito. Ya puedes gestionar tus matrículas.' });
        setRegisterForm(blankRegister);
      }
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function enroll(courseId) {
    try {
      const result = await api('/matriculas', { method: 'POST', body: JSON.stringify({ cursoId: Number(courseId) }) });
      setNotice({ type: 'success', text: result.mensaje || '¡Matrícula realizada exitosamente!' });
      await loadDashboard();
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    }
  }

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST' });
      setUser(null);
      setCourses([]);
      setEnrollments([]);
      setNotice({ type: 'success', text: 'Has cerrado sesión de forma segura.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    }
  }

  const enrolledCourseIds = new Set(enrollments.map((item) => String(item.cursoId)));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-medium">Cargando portal universitario...</p>
        </div>
      </div>
    );
  }

  // DISEÑO 1: PANTALLA DE AUTENTICACIÓN (Split-screen moderno)
  if (!user) {
    return (
      <div className="min-h-screen lg:grid lg:grid-cols-12 bg-slate-900 text-slate-100">
        {/* Panel izquierdo decorativo con NUEVO LOGO */}
        <div className="relative hidden lg:col-span-5 lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 border-r border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Sistema de Matrícula</p>
              <span className="font-extrabold tracking-tight text-lg text-white">Academia U.</span>
            </div>
          </div>
          <div className="space-y-4 my-auto">
            <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">Gestión Inteligente</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">Tu carrera universitaria centralizada.</h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">Inscripciones en tiempo real y gestión de matrículas sin complicaciones.</p>
          </div>
        </div>

        {/* Panel derecho (Formulario) */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-slate-950">
          <div className="mx-auto w-full max-w-md space-y-6">
            <Notice notice={notice} onClose={() => setNotice({ type: '', text: '' })} />

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">{authMode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta estudiantil'}</h2>
              <p className="text-sm text-slate-400">{authMode === 'login' ? 'Ingresa tus credenciales para acceder al sistema.' : 'Completa el formulario para registrarte en el portal.'}</p>
            </div>

            <div className="grid grid-cols-2 rounded-2xl bg-slate-900 p-1.5 border border-slate-800">
              <button
                onClick={() => { setAuthMode('login'); setNotice({ type: '', text: '' }); }}
                className={`rounded-xl py-2.5 text-xs font-bold transition-all ${authMode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => { setAuthMode('register'); setNotice({ type: '', text: '' }); }}
                className={`rounded-xl py-2.5 text-xs font-bold transition-all ${authMode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Registrarse
              </button>
            </div>

            <form onSubmit={submitAuth} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <Field
                    label="Nombre Completo"
                    value={registerForm.nombre}
                    onChange={(e) => setRegisterForm({ ...registerForm, nombre: e.target.value })}
                    placeholder="Ej. Ana Torres"
                    autoComplete="name"
                  />

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Carrera</label>
                    <select
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      value={registerForm.carrera}
                      onChange={(e) => setRegisterForm({ ...registerForm, carrera: e.target.value })}
                      required
                    >
                      <option value="">Selecciona tu carrera</option>
                      {CARRERAS_PERMITIDAS.map((carrera) => (
                        <option key={carrera} value={carrera}>{carrera}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Semestre (1 al 9)</label>
                    <select
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      value={registerForm.semestre}
                      onChange={(e) => setRegisterForm({ ...registerForm, semestre: e.target.value })}
                      required
                    >
                      {SEMESTRES_PERMITIDOS.map((semestre) => (
                        <option key={semestre} value={semestre}>Semestre {semestre}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <Field
                label="Correo Electrónico"
                type="email"
                value={authMode === 'login' ? loginForm.email : registerForm.email}
                onChange={(e) => authMode === 'login' ? setLoginForm({ ...loginForm, email: e.target.value }) : setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="estudiante@universidad.edu"
                autoComplete="email"
              />

              <Field
                label="Contraseña"
                type="password"
                value={authMode === 'login' ? loginForm.password : registerForm.password}
                onChange={(e) => authMode === 'login' ? setLoginForm({ ...loginForm, password: e.target.value }) : setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="••••••••••••"
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              />

              <button
                disabled={submitting}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 disabled:opacity-50 mt-2"
              >
                {submitting ? 'Procesando...' : authMode === 'login' ? 'Entrar al Sistema' : 'Crear Cuenta'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // DISEÑO 2: PANEL PRINCIPAL (Dashboard con Sidebar y NUEVO LOGO)
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar de navegación con NUEVO LOGO */}
      <aside className="w-full md:w-72 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Portal</p>
              <h2 className="text-base font-bold text-white">Academia U.</h2>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800/80 space-y-1">
            <p className="text-xs text-slate-400 font-medium">Estudiante activo</p>
            <p className="text-sm font-bold text-white truncate">{user.nombre}</p>
            <p className="text-xs text-indigo-400 font-medium truncate">{user.carrera}</p>
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 mt-2">
              <span>Semestre: {user.semestre}</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-bold border border-emerald-500/20">Regular</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('cursos')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'cursos' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <span>📚 Oferta de Cursos</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{courses.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('mis-matriculas')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'mis-matriculas' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <span>🎓 Mis Matrículas</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{enrollments.length}</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800/80">
          <button
            onClick={logout}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8 bg-slate-900">
        <Notice notice={notice} onClose={() => setNotice({ type: '', text: '' })} />

        {/* Header Superior del Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {activeTab === 'cursos' ? 'Catálogo de Asignaturas' : 'Historial de Matrículas'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {activeTab === 'cursos' ? 'Selecciona los cursos disponibles para inscribirte este periodo.' : 'Revisa las asignaturas en las que te encuentras matriculado actualmente.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 px-4 py-2 text-xs font-semibold text-slate-300">
              Total Cursos: <span className="text-indigo-400 font-bold">{courses.length}</span>
            </div>
            <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 px-4 py-2 text-xs font-semibold text-slate-300">
              Matriculados: <span className="text-emerald-400 font-bold">{enrollments.length}</span>
            </div>
          </div>
        </div>

        {/* Vista: Cursos */}
        {activeTab === 'cursos' && (
          <div>
            {courses.length ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => {
                  const enrolled = enrolledCourseIds.has(String(course.id));
                  const cupos = course.cuposDisponibles ?? course.cupos;
                  return (
                    <div key={course.id} className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl transition-all hover:border-indigo-500/50 hover:shadow-indigo-500/10">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">Curso #{course.id}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${Number(cupos) > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                            {cupos} cupos
                          </span>
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{course.nombre}</h3>
                        <p className="mt-1 text-sm text-slate-400">Docente: <span className="text-slate-200 font-medium">{course.docente}</span></p>
                      </div>
                      <button
                        disabled={enrolled || Number(cupos) < 1}
                        onClick={() => enroll(course.id)}
                        className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-bold transition-all ${enrolled ? 'cursor-not-allowed bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : Number(cupos) < 1 ? 'cursor-not-allowed bg-slate-800 text-slate-500' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500'}`}
                      >
                        {enrolled ? '✓ Ya estás matriculado' : Number(cupos) < 1 ? 'Sin cupos disponibles' : 'Matricularme ahora'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-12 text-center text-slate-400">
                No hay cursos disponibles cargados en la base de datos.
              </div>
            )}
          </div>
        )}

        {/* Vista: Mis Matrículas */}
        {activeTab === 'mis-matriculas' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
            {enrollments.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                  <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Asignatura</th>
                      <th className="px-6 py-4 font-semibold">Docente Encargado</th>
                      <th className="px-6 py-4 font-semibold">Fecha de Matrícula</th>
                      <th className="px-6 py-4 font-semibold text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {enrollments.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">{item.curso}</td>
                        <td className="px-6 py-4 text-slate-300">{item.docente}</td>
                        <td className="px-6 py-4 text-slate-400">{new Date(item.fechaMatricula).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">Inscrito</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                Todavía no te has matriculado en ningún curso. Explora la pestaña de cursos para inscribirte.
              </div>
            )}
          </div>
        )}

        <footer className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
          Sistema de Matrículas Universitario
        </footer>
      </main>
    </div>
  );
}