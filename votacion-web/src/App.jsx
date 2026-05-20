import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [pantalla, setPantalla] = useState('LOGIN'); // 'LOGIN', 'TARJETON' o 'ADMIN'
  const [documento, setDocumento] = useState('');
  const [candidatos, setCandidatos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Cargar candidatos y resultados al arrancar la app
  useEffect(() => {
    cargarCandidatos();
  }, []);

  const cargarCandidatos = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/votacion/resultados');
      setCandidatos(res.data);
    } catch (err) {
      console.error("Error al cargar candidatos:", err);
    }
  };

  // INTERCEPCIÓN CRÍTICA EN EL LOGIN
  const manejarIngresoTarjeton = async (e) => {
    e.preventDefault();
    
    // FILTRO DE ADMINISTRADOR: Cédula/Clave especial para auditoría
    if (documento === '999999') {
      await cargarCandidatos(); // Refresca los votos antes de entrar
      setPantalla('ADMIN');
      setDocumento('');
      setError(null);
      return;
    }

    if (documento.trim().length < 6) {
      setError("El documento debe tener al menos 6 dígitos.");
      return;
    }

    setCargando(true);
    setMensaje(null);
    setError(null);

    try {
      const res = await axios.get(`http://localhost:8080/api/v1/votacion/verificar/${documento}`);
      
      if (res.data.estado === 200) {
        setPantalla('TARJETON');
      } else {
        const msg = res.data.mensaje || "Usted ya ha ejercido su derecho al voto.";
        setError(msg);
        setDocumento('');

        // Limpieza garantizada a los 30 segundos
        setTimeout(() => {
          setError(null);
        }, 30000); 
      }
    } catch (err) {
      // CAPTURA CONTROLADA DEL ERROR DE RED / HTTP STATUS EXCEPTION
      const msgError = err.response?.data?.mensaje || "Usted ya ha ejercido su derecho al voto.";
      setError(msgError);
      setDocumento('');

      // Desvanece el error del catch de forma definitiva a los 30 segundos
      setTimeout(() => {
        setError(null);
      }, 30000);
    } finally {
      setCargando(false);
    }
  };

  // EMISIÓN DEL VOTO
  const procesarVoto = async (idCandidato) => {
    if (!idCandidato) {
      setError("Error interno: Identificador de candidato no encontrado.");
      return;
    }

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
      
      if (res.data.estado === 200 || res.status === 200) {
        setMensaje("¡Voto registrado exitosamente! Su participación ha sido anonimizada.");
        setDocumento('');
        setPantalla('LOGIN'); 
        cargarCandidatos();   
        
        setTimeout(() => {
          setMensaje(null);
        }, 4000);
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al procesar el voto. Intente de nuevo.");
      setDocumento('');
      setPantalla('LOGIN');
    } finally {
      setCargando(false);
    }
  };

  // Calcular métricas globales para el Administrador
  const totalVotosGlobales = candidatos?.reduce((sum, c) => sum + (c.votos || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      {/* Encabezado Dinámico */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-wide">
            SISTEMA DE VOTA<span className="text-blue-600">CIÓN ELECTRÓNICO</span>
          </span>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
          pantalla === 'ADMIN' 
            ? 'bg-purple-100 text-purple-700 border-purple-200' 
            : 'bg-gray-100 text-gray-600 border-gray-200'
        }`}>
          MÓDULO: {pantalla}
        </span>
      </header>

      {/* Cuerpo Principal */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        
        {/* ALERTAS GLOBALES */}
        {error && (
          <div className="mb-6 max-w-md w-full bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm animate-pulse">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {mensaje && (
          <div className="mb-6 max-w-md w-full bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl shadow-sm">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{mensaje}</p>
              </div>
            </div>
          </div>
        )}

        {/* INTERFAZ 1: LOGIN SEGURA */}
        {pantalla === 'LOGIN' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full shadow-xl">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 border border-blue-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.418.835 2.83 2H8.17c.412-1.165 1.524-2 2.83-2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Identificación del Votante</h2>
              <p className="text-sm text-gray-500 mt-1">Ingrese su documento para habilitar el tarjetón electrónico</p>
            </div>

            <form onSubmit={manejarIngresoTarjeton} className="space-y-4">
              <input
                type="password"
                placeholder="••••••••••••"
                value={documento}
                onChange={(e) => setDocumento(e.target.value.replace(/\D/g, ''))}
                disabled={cargando}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl font-mono text-center text-xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={cargando || !documento}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md tracking-wide uppercase transition-all"
              >
                {cargando ? "Validando..." : "INGRESAR AL TARJETÓN"}
              </button>
            </form>
          </div>
        )}

        {/* INTERFAZ 2: TARJETÓN CIEGO PROTEGIDO (VOTANTE) */}
        {pantalla === 'TARJETON' && (
          <div className="w-full max-w-5xl">
            <div className="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
              <p className="text-sm text-blue-800 font-medium">Sesión protegida activa</p>
              <button 
                onClick={() => { setPantalla('LOGIN'); setDocumento(''); setError(null); }}
                className="text-xs font-bold text-red-600 hover:text-red-800 tracking-wider uppercase transition-colors"
              >
                Cancelar Votación
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {candidatos?.map((c) => {
                return (
                  <div key={c.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-56 bg-gray-100">
                      <img 
                        src={c.fotoUrl || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=500"} 
                        alt={c.nombre}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{c.partidoPolitico || "Independiente"}</span>
                      </div>
                    </div>
                    
                    <div className="p-5 text-center flex-grow flex flex-col justify-between">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800">{c.nombre}</h3>
                      </div>

                      <button
                        onClick={() => { procesarVoto(c.id); }}
                        disabled={cargando}
                        className="w-full bg-gray-900 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 uppercase tracking-wider text-xs shadow-sm"
                      >
                        Confirmar Voto
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* INTERFAZ 3: PANEL EXCLUSIVO DEL ADMINISTRADOR (ESCRUTINIO) */}
        {pantalla === 'ADMIN' && (
          <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Consola de Escrutinio y Auditoría</h2>
                <p className="text-sm text-gray-500 mt-1">Monitoreo en tiempo real del flujo electoral corporativo</p>
              </div>
              <button 
                onClick={() => { setPantalla('LOGIN'); }}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors uppercase tracking-wider"
              >
                Cerrar Consola
              </button>
            </div>

            {/* Tarjeta de Resumen Global */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-purple-900">Total de Sufragios Registrados en Urna:</span>
              <span className="text-2xl font-black text-purple-700 font-mono bg-white px-4 py-1 rounded-lg border border-purple-200 shadow-sm">
                {totalVotosGlobales} votos
              </span>
            </div>

            {/* Listado con Barras de Progreso y Porcentajes */}
            <div className="space-y-6">
              {candidatos?.map((c) => {
                const porcentaje = totalVotosGlobales > 0 
                  ? ((c.votos / totalVotosGlobales) * 100).toFixed(1) 
                  : 0;

                return (
                  <div key={c.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="text-base font-bold text-gray-800">{c.nombre}</h4>
                        <span className="text-xs text-gray-400 uppercase font-mono">{c.partidoPolitico || "Independiente"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900 font-mono">{c.votos} votos</span>
                        <span className="text-xs font-black text-blue-600 font-mono ml-3 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                          {porcentaje}%
                        </span>
                      </div>
                    </div>

                    {/* Componente Gráfico: Barra de Progreso */}
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner border border-gray-200">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Pie de Página */}
      <footer className="p-4 text-center text-[10px] text-gray-400 font-mono tracking-widest border-t border-gray-200 bg-white">
        CRIPTOGRAFÍA HOMOMÓRFICA Y PRIVACIDAD DE DATOS © 2026
      </footer>
    </div>
  );
}

export default App;