import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [pantalla, setPantalla] = useState('LOGIN'); // 'LOGIN' o 'TARJETON'
  const [documento, setDocumento] = useState('');
  const [candidatos, setCandidatos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Cargar candidatos al arrancar la app
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
    
    if (documento.trim().length < 6) {
      setError("El documento debe tener al menos 6 dígitos.");
      return;
    }

    setCargando(true);
    setMensaje(null);
    setError(null);

    try {
      // Consultamos al nuevo endpoint antes de cambiar de interfaz
      const res = await axios.get(`http://localhost:8080/api/v1/votacion/verificar/${documento}`);
      
      if (res.data.estado === 200) {
        // ÚNICO CAMINO PERMITIDO AL TARJETÓN: Votante limpio
        setPantalla('TARJETON');
      } else {
        // Si el backend responde con 403 u otro estado de bloqueo
        setError(res.data.mensaje || "Usted ya ha ejercido su derecho al voto.");
        setDocumento('');
      }
    } catch (err) {
      // Captura de errores de excepciones controladas del backend
      const msgError = err.response?.data?.mensaje || "Usted ya ha ejercido su derecho al voto.";
      setError(msgError);
      setDocumento('');
    } finally {
      setCargando(false);
    }
  };

  // EMISIÓN DEL VOTO CON MENSAJE TEMPORAL MOMENTÁNEO
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
      
      // Ajustado para leer ApiResponse estándar (código 200 o propiedad estado)
      if (res.data.estado === 200 || res.status === 200) {
        setMensaje("¡Voto registrado exitosamente! Su participación ha sido anonimizada.");
        setDocumento('');
        setPantalla('LOGIN'); // Expulsión inmediata al Login
        cargarCandidatos();   // Refrescar gráficos en tiempo real

        // El mensaje de éxito se destruye automáticamente a los 4 segundos
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      {/* Encabezado */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-wide">SISTEMA DE <span className="text-blue-600">VOTACIÓN ELECTRÓNICO</span></span>
        </div>
        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200">MÓDULO: ELECCIONES 2026</span>
      </header>

      {/* Cuerpo Principal */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        
        {/* ALERTAS GLOBALES */}
        {error && (
          <div className="mb-6 max-w-md w-full bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm transition-all duration-300 animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {mensaje && (
          <div className="mb-6 max-w-md w-full bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl shadow-sm transition-all duration-300">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{mensaje}</p>
              </div>
            </div>
          </div>
        )}

        {/* INTERFAZ 1: LOGIN */}
        {pantalla === 'LOGIN' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full shadow-xl transform transition-all duration-300 hover:shadow-2xl">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 border border-blue-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.418.835 2.83 2H8.17c.412-1.165 1.524-2 2.83-2z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Identificación del Votante</h2>
              <p className="text-sm text-gray-500 mt-1">Ingrese su documento para validar y habilitar el tarjetón</p>
            </div>

            <form onSubmit={manejarIngresoTarjeton} className="space-y-4">
              <input
                type="text"
                placeholder="Número de Cédula"
                value={documento}
                onChange={(e) => setDocumento(e.target.value.replace(/\D/g, ''))}
                disabled={cargando}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl font-mono text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                type="submit"
                disabled={cargando || !documento}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md tracking-wide transition-all duration-200 transform active:scale-[0.98] disabled:bg-gray-300 disabled:scale-100 disabled:shadow-none flex justify-center items-center"
              >
                {cargando ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : "INGRESAR AL TARJETÓN"}
              </button>
            </form>
          </div>
        )}

        {/* INTERFAZ 2: TARJETÓN PROTEGIDO */}
        {pantalla === 'TARJETON' && (
          <div className="w-full max-w-5xl animate-fadeIn">
            <div className="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
              <p className="text-sm text-blue-800 font-medium">Sesión activa para el documento: <span className="font-mono font-bold">{documento}</span></p>
              <button 
                onClick={() => { setPantalla('LOGIN'); setDocumento(''); setError(null); }}
                className="text-xs font-bold text-red-600 hover:text-red-800 tracking-wider uppercase transition-colors"
              >
                Cancelar Votación
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {candidatos.map((c) => (
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
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{c.nombre}</h3>
                      <p className="text-xs text-gray-400 mt-1">Escrutinio General: {c.votos || 0} votos</p>
                    </div>

                    <button
                      onClick={() => procesarVoto(c.id)}
                      disabled={cargando}
                      className="w-full bg-gray-900 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 uppercase tracking-wider text-xs shadow-sm"
                    >
                      Confirmar Voto
                    </button>
                  </div>
                </div>
              ))}
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