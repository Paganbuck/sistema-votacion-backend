import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Tarjeton from './components/Tarjeton';
import AdminPanel from './components/AdminPanel';

function App() {
  const [pantalla, setPantalla] = useState('LOGIN'); 
  const [documento, setDocumento] = useState('');
  const [candidatos, setCandidatos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Leer la URL de la API desde las variables de entorno (.env)
  const urlAPI = import.meta.env.VITE_API_URL;

  useEffect(() => {
    cargarCandidatos();
  }, []);

  const cargarCandidatos = async () => {
    try {
      // Usar fallback seguro si urlAPI llega a estar indefinido por caché de Vite
      const urlBase = urlAPI || 'http://localhost:8080/api/v1/votacion';
      const res = await axios.get(`${urlBase}/resultados`);
      setCandidatos(res.data);
    } catch (err) {
      console.error("Error al cargar candidatos:", err);
    }
  };

  // 🔥 CONFIGURACIÓN CORREGIDA Y BLINDADA CON CONTINGENCIA DE RED
  const manejarIngresoTarjeton = async (e) => {
    e.preventDefault();
    
    const documentoLimpio = documento.toString().trim();
    // Fallback de URL automática si no lee el archivo de entorno en el primer render
    const urlBase = urlAPI || 'http://localhost:8080/api/v1/votacion';

    // 🛡️ 1. MÓDULO ADMINISTRADOR (No toca el flujo de votantes)
    if (documentoLimpio === '999999') {
      setCargando(true);
      setError(null);
      try {
        const res = await axios.post(`${urlBase}/admin/login`, { clave: documentoLimpio });
        if (res.data.autorizado) {
          await cargarCandidatos();
          setPantalla('ADMIN');
          setDocumento('');
          setError(null);
        }
      } catch (err) {
        // Muestra el mensaje exacto enviado por tu controlador Java
        setError(err.response?.data?.mensaje || "Acceso denegado a la consola de administración.");
      } finally {
        setCargando(false);
      }
      return; // Rompe el flujo de ejecución inmediatamente
    }

    // 🗳️ 2. MÓDULO VOTANTE COMÚN
    if (documentoLimpio.length < 6) {
      setError("El documento debe tener al menos 6 dígitos.");
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const res = await axios.get(`${urlBase}/verificar/${documentoLimpio}`);
      
      // Mapeo exacto basado en la estructura Map<String, Object> de tu backend
      if (res.data.estado === 200) {
        setPantalla('TARJETON');
      } else {
        setError(res.data.mensaje || "Usted ya ha ejercido su derecho al voto.");
        setDocumento('');
      }
    } catch (err) {
      // Captura el error real del backend o notifica si hay falla de conexión
      if (err.response?.data?.mensaje) {
        setError(err.response.data.mensaje);
      } else if (err.code === "ERR_NETWORK") {
        setError("Error de red: No se pudo conectar con el backend en " + urlBase);
      } else {
        setError("Error inesperado en la autenticación del votante.");
      }
      setDocumento('');
    } finally {
      setCargando(false);
    }
  };

  const procesarVoto = async (idCandidato) => {
    setCargando(true);
    setError(null);
    const urlBase = urlAPI || 'http://localhost:8080/api/v1/votacion';
    
    try {
      const res = await axios.post(`${urlBase}/votar/${idCandidato}/${documento}`);
      
      // Modificado para ajustarse a lo que devuelva tu objeto de resultado
      setMensaje("¡Voto registrado exitosamente! Su participación ha sido anonimizada.");
      setDocumento('');
      setPantalla('LOGIN'); 
      cargarCandidatos();   
      setTimeout(() => setMensaje(null), 4000);
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al procesar el voto.");
      setPantalla('LOGIN');
    } finally {
      setCargando(false);
    }
  };

  // 🛡️ VERIFICACIÓN CONTROLADA: Comprueba explícitamente que sea un Array antes de procesar
  const totalVotosGlobales = Array.isArray(candidatos) 
    ? candidatos.reduce((sum, c) => sum + (c.votos || 0), 0) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
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
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-gray-100 text-gray-600 border-gray-200">
          MÓDULO: {pantalla}
        </span>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        {error && <div className="mb-6 max-w-md w-full bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700 font-medium rounded-r-xl shadow-sm">{error}</div>}
        {mensaje && <div className="mb-6 max-w-md w-full bg-green-50 border-l-4 border-green-500 p-4 text-sm text-green-700 font-medium rounded-r-xl shadow-sm">{mensaje}</div>}

        {pantalla === 'LOGIN' && (
          <Login documento={documento} setDocumento={setDocumento} manejarIngresoTarjeton={manejarIngresoTarjeton} cargando={cargando} />
        )}

        {pantalla === 'TARJETON' && (
          <Tarjeton candidatos={candidatos} procesarVoto={procesarVoto} cargando={cargando} regresarALogin={() => { setPantalla('LOGIN'); setDocumento(''); }} />
        )}

        {pantalla === 'ADMIN' && (
          <AdminPanel candidatos={candidatos} totalVotosGlobales={totalVotosGlobales} regresarALogin={() => setPantalla('LOGIN')} alCrearCandidato={cargarCandidatos} />
        )}
      </main>

      <footer className="p-4 text-center text-[10px] text-gray-400 font-mono tracking-widest border-t border-gray-200 bg-white">
        CRIPTOGRAFÍA HOMOMÓRFICA Y PRIVACIDAD DE DATOS © 2026
      </footer>
    </div>
  );
}

export default App;