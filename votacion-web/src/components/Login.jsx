import React from 'react';

export default function Login({ documento, setDocumento, manejarIngresoTarjeton, cargando }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full shadow-xl">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 border border-blue-100">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.418.835 2.83 2H8.17c.412-1.165 1.524-2 2.83-2z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Identificación del Votante</h2>
        <p className="text-sm text-gray-500 mt-1">Ingrese su documento o clave de acceso al sistema</p>
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
          {cargando ? "Validando..." : "INGRESAR AL SISTEMA"}
        </button>
      </form>
    </div>
  );
}