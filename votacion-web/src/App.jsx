import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Vote, CheckCircle, AlertTriangle, Fingerprint } from 'lucide-react';

function App() {
  const [candidatos, setCandidatos] = useState([]);
  const [documento, setDocumento] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  
  // Control de flujo por pantallas: 'LOGIN' o 'TARJETON'
  const [pantalla, setPantalla] = useState('LOGIN'); 

  const cargarCandidatos = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/votacion/resultados');
      setCandidatos(res.data);
    } catch (err) { 
      console.error("Error al cargar candidatos:", err); 
    }
  };

  useEffect(() => {
    cargarCandidatos();
  }, []);

  const manejarIngresoTarjeton = (e) => {
    e.preventDefault();
    if (documento.trim().length < 6) {
      setError("El documento debe tener al menos 6 dígitos.");
      return;
    }
    setCargando(true);
    setMensaje(null);
    setError(null);

    // Transición suave al tarjetón electoral privado
    setTimeout(() => {
      setPantalla('TARJETON');
      setCargando(false);
    }, 400);
  };

  const procesarVoto = async (idCandidato) => {
  if (!documento.trim()) {
    setError("Sesión inválida. Ingrese su documento nuevamente.");
    setPantalla('LOGIN');
    return;
  }
  
  setCargando(true); 
  setMensaje(null); 
  setError(null);

  try {
    const res = await axios.post(`http://localhost:8080/api/v1/votacion/votar/${idCandidato}/${documento}`);
    
    if (res.data.estado === 200) {
      // 1. Establecemos el mensaje de éxito de forma inmediata
      setMensaje(`¡Voto registrado exitosamente! Su participación ha sido anonimizada.`);
      setDocumento(''); 
      setPantalla('LOGIN'); // Destruye el tarjetón y regresa al inicio de inmediato
      cargarCandidatos();

      // 2. NUEVO: Hacemos que el mensaje sea momentáneo. 
      // Se borrará automáticamente después de 4 segundos (4000 milisegundos)
      setTimeout(() => {
        setMensaje(null);
      }, 4000);

    } else { 
      setError(res.data.mensaje); 
    }
  } catch (err) {
    setError(err.response?.data?.mensaje || "Este documento ya registró un voto en el sistema.");
    setDocumento('');
    setPantalla('LOGIN');
  } finally { 
    setCargando(false); 
  }
};

  return (
    <div className="min-h-screen bg-[#F2F6F5] text-slate-800 font-sans selection:bg-[#109DFA]/20 flex flex-col justify-between">
      
      {/* Navbar Minimalista */}
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl shadow-md" style={{ backgroundColor: '#109DFA' }}>
              <Vote className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              SISTEMA DE <span style={{ color: '#109DFA' }}>SUFRAGIO ELECTRÓNICO</span>
            </h1>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full uppercase tracking-wider">
            Módulo: {pantalla}
          </span>
        </div>
      </nav>

      {/* Cuerpo Principal de la Aplicación */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow w-full flex flex-col justify-center">
        
        {/* Alertas globales */}
        {(mensaje || error) && (
          <div className={`max-w-2xl mx-auto mb-8 p-5 rounded-2xl border w-full flex items-center gap-4 shadow-sm ${mensaje ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
            {mensaje ? <CheckCircle className="w-6 h-6 text-emerald-600" /> : <AlertTriangle className="w-6 h-6 text-rose-600" />}
            <p className="font-semibold text-sm">{mensaje || error}</p>
          </div>
        )}

        {/* PANTALLA 1: AUTENTICACIÓN / IDENTIFICACIÓN */}
        {pantalla === 'LOGIN' && (
          <div className="max-w-md mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white border-2 p-8 rounded-3xl shadow-sm text-center" style={{ borderColor: '#80AAA7' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: '#E6EEED' }}>
                <Fingerprint style={{ color: '#80AAA7' }} className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Identificación del Votante</h2>
              <p className="text-slate-500 mb-6 text-sm">Ingrese su documento para habilitar el tarjetón electrónico</p>
              
              <form onSubmit={manejarIngresoTarjeton} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={documento}
                  disabled={cargando}
                  onChange={(e) => setDocumento(e.target.value.replace(/\D/g, ''))}
                  placeholder="Cédula de Ciudadanía"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 text-2xl text-center font-mono font-bold transition-all placeholder:text-slate-300 focus:outline-none focus:border-[#109DFA]"
                />
                
                <button
                  type="submit"
                  disabled={documento.trim().length < 6 || cargando}
                  className="w-full py-4 text-white font-bold rounded-2xl transition-all shadow-md uppercase text-sm tracking-wider disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  style={{ backgroundColor: documento.trim().length >= 6 && !cargando ? '#109DFA' : '' }}
                >
                  {cargando ? 'Validando Acceso...' : 'Ingresar al Tarjetón'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PANTALLA 2: TARJETÓN DE VOTACIÓN SECRETO (Porcentajes Ocultos) */}
        {pantalla === 'TARJETON' && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-400 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tarjetón Electoral</h2>
              <p className="text-slate-500 mt-2 text-sm">Seleccione la opción de su preferencia. Su voto es secreto, seguro y totalmente anónimo.</p>
            </div>

            {/* Grid simétrico y limpio para los 4 candidatos de la BD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
              {candidatos.map((c) => {
                const esBlanco = c.nombre.toLowerCase().includes('blanco');

                return (
                  <div 
                    key={c.id} 
                    className={`bg-white border rounded-[2rem] overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md ${
                      esBlanco ? 'border-dashed border-slate-300 bg-slate-50/50' : 'border-slate-200'
                    }`}
                  >
                    {/* Contenedor de la Foto con Proporciones Perfectas */}
                    <div className="h-56 relative bg-slate-100 overflow-hidden">
                      <img 
                        src={c.fotoUrl} 
                        alt={c.nombre} 
                        className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                      <div className="absolute bottom-4 left-5 right-5">
                        <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-0.5 ${esBlanco ? 'text-slate-400' : 'text-sky-300'}`}>
                          {c.partidoPolitico}
                        </p>
                        <h3 className="text-lg font-bold text-white leading-tight">{c.nombre}</h3>
                      </div>
                    </div>

                    {/* Botón de Acción Aislado Inferior */}
                    <div className="p-6">
                      <button
                        type="button"
                        disabled={cargando}
                        onClick={() => procesarVoto(c.id || c.candidatoId)}
                        className="w-full py-3 text-white font-bold rounded-xl transition-all shadow-sm uppercase text-xs tracking-wider active:scale-[0.98] hover:opacity-95"
                        style={{ backgroundColor: esBlanco ? '#475569' : '#109DFA' }}
                      >
                        {esBlanco ? 'Seleccionar Blanco' : 'Votar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer Institucional */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center">
        <p className="text-slate-400 text-[10px] tracking-widest uppercase font-bold">
          Criptografía Homomórfica y Privacidad de Datos © 2026
        </p>
      </footer>
    </div>
  );
}

export default App;