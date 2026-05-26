import React, { useState } from 'react';
import axios from 'axios';

export default function AdminPanel({ candidatos, totalVotosGlobales, regresarALogin, alCrearCandidato }) {
  // Estados locales para el nuevo formulario de candidatos
  const [nombre, setNombre] = useState('');
  const [partidoPolitico, setPartidoPolitico] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const [errorForm, setErrorForm] = useState(null);

  const urlAPI = import.meta.env.VITE_API_URL;

  const registrarNuevoCandidato = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !partidoPolitico.trim()) {
      setErrorForm("Nombre y Partido Político son obligatorios.");
      return;
    }

    setLoadingForm(true);
    setErrorForm(null);

    // 🛡️ Fallback automático por si Vite no indexa el archivo .env en este componente
    const urlBase = urlAPI || 'http://localhost:8080/api/v1/votacion';

    try {
      await axios.post(`${urlBase}/candidatos`, {
        nombre: nombre.trim(),
        partidoPolitico: partidoPolitico.trim(),
        fotoUrl: fotoUrl.trim() || ""
      });
      
      // Limpiar formulario si la inserción es correcta
      setNombre('');
      setPartidoPolitico('');
      setFotoUrl('');
      
      // Refrescar la lista global en App.jsx
      alCrearCandidato(); 
    } catch (err) {
      console.error("Error detallado en la petición:", err.response || err);
      
      // Captura el mensaje específico del backend o mapea el error de red
      setErrorForm(
        err.response?.data?.mensaje || 
        `Error al conectar con ${urlBase}/candidatos (Estado: ${err.response?.status || "Red / CORS"})`
      );
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* SECCIÓN A: PANEL DE ESCRUTINIO */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Consola de Escrutinio y Auditoría</h2>
            <p className="text-sm text-gray-500 mt-1">Monitoreo en tiempo real del flujo electoral corporativo</p>
          </div>
          <button 
            onClick={regresarALogin}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors uppercase tracking-wider"
          >
            Cerrar Consola
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-purple-900">Total de Sufragios Registrados en Urna:</span>
          <span className="text-2xl font-black text-purple-700 font-mono bg-white px-4 py-1 rounded-lg border border-purple-200 shadow-sm">
            {totalVotosGlobales} votos
          </span>
        </div>

        <div className="space-y-6">
          {candidatos?.map((c) => {
            const porcentaje = totalVotosGlobales > 0 ? ((c.votos / totalVotosGlobales) * 100).toFixed(1) : 0;
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
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner border border-gray-200">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${porcentaje}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN B: FORMULARIO PARA CREAR CANDIDATOS */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Registrar Nuevo Candidato</h3>
        <p className="text-sm text-gray-500 mb-4">Añada nuevos aspirantes al tarjetón sin alterar la base de datos de manera manual</p>
        
        {errorForm && <p className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3 font-medium">{errorForm}</p>}

        <form onSubmit={registrarNuevoCandidato} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nombre Completo</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Clara López" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Partido Político</label>
            <input 
              type="text" 
              value={partidoPolitico} 
              onChange={(e) => setPartidoPolitico(e.target.value)}
              placeholder="Ej: Movimiento Verde" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">URL de la Foto (Opcional)</label>
            <input 
              type="url" 
              value={fotoUrl} 
              onChange={(e) => setFotoUrl(e.target.value)}
              placeholder="https://enlace.com/imagen.jpg" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div className="md:col-span-3 text-right">
            <button 
              type="submit"
              disabled={loadingForm}
              className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:bg-gray-400"
            >
              {loadingForm ? "Guardando..." : "Guardar Aspirante"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}