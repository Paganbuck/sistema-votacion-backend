import React from 'react';

export default function Tarjeton({ candidatos, procesarVoto, cargando, regresarALogin }) {
  const imagenPorDefecto = "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=500&auto=format&fit=crop&q=60";

  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
        <p className="text-sm text-blue-800 font-medium">Sesión protegida activa</p>
        <button 
          onClick={regresarALogin}
          className="text-xs font-bold text-red-600 hover:text-red-800 tracking-wider uppercase transition-colors"
        >
          Cancelar Votación
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {candidatos
          // 🛡️ Filtro blindado: elimina cualquier candidato que tenga "test" o "concurrencia" en el nombre
          ?.filter((c) => {
            if (!c.nombre) return false;
            const nombreMinuscula = c.nombre.toLowerCase();
            return !nombreMinuscula.includes("test") && !nombreMinuscula.includes("concurrencia");
          })
          .map((c) => {
            const tieneFotoValida = c.fotoUrl && c.fotoUrl !== "https://link.com/foto.jpg" && c.fotoUrl.trim() !== "";

            return (
              <div key={c.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                
                <div className="w-full h-52 bg-slate-50 flex items-center justify-center border-b border-gray-100">
                  <img 
                    src={tieneFotoValida ? c.fotoUrl : imagenPorDefecto} 
                    alt={c.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = imagenPorDefecto; }}
                  />
                </div>
                
                <div className="p-5 text-center flex-grow flex flex-col justify-between">
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">{c.nombre}</h3>
                    <div className="text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full uppercase tracking-wider">
                      {c.partidoPolitico || "Independiente"}
                    </div>
                  </div>

                  <button
                    onClick={() => procesarVoto(c.id)}
                    disabled={cargando}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 uppercase tracking-wider text-xs shadow-sm"
                  >
                    Confirmar Voto
                  </button>
                </div>

              </div>
            );
          })}
      </div>
    </div>
  );
}