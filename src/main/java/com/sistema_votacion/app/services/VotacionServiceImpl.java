package com.sistema_votacion.app.services;

import com.sistema_votacion.app.models.Voto;
import com.sistema_votacion.app.models.VotanteRegistrado;
import com.sistema_votacion.app.repositories.CandidatoRepository;
import com.sistema_votacion.app.repositories.VotoRepository;
import com.sistema_votacion.app.repositories.VotanteRegistradoRepository;
import com.sistema_votacion.app.utils.ApiResponse;
import com.sistema_votacion.app.utils.HashUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class VotacionServiceImpl implements VotacionService {

    @Autowired
    private CandidatoRepository candidatoRepository;

    @Autowired
    private VotoRepository votoRepository;

    @Autowired
    private VotanteRegistradoRepository votanteRegistradoRepository;

    @Override
    @Transactional
    public Object registrarVoto(Long candidatoId, String documentoVotante) {
        // 1. Validar duplicidad usando el repositorio de control independiente
        if (votanteRegistradoRepository.existsById(documentoVotante)) {
            throw new RuntimeException("Usted ya ha ejercido su derecho al voto.");
        }

        // 2. Si no ha votado, buscamos el candidato y guardamos de forma aislada
        return candidatoRepository.findById(candidatoId).map(candidato -> {
            
            // A) Registrar al votante en su tabla de control exclusiva
            VotanteRegistrado votante = new VotanteRegistrado();
            votante.setDocumento(documentoVotante);
            votanteRegistradoRepository.save(votante);

            // B) Guardar el voto de manera 100% anónima (sin la cédula en texto plano)
            Voto nuevoVoto = new Voto();
            nuevoVoto.setCandidato(candidato);
            
            // Hash de auditoría física basado únicamente en variables del sistema y candidato
            String datosParaHash = candidato.getId() + "-" + System.currentTimeMillis();
            nuevoVoto.setHashIntegridad(HashUtil.generarSHA512(datosParaHash));
            
            votoRepository.save(nuevoVoto);
            return new ApiResponse("Voto registrado con éxito", 200, candidato.getNombre());
            
        }).orElseThrow(() -> new RuntimeException("El candidato no existe en el sistema."));
    }
    
    @Override
    public List<Map<String, Object>> obtenerResultados() {
    // 1. Obtener todos los candidatos de la base de datos
    List<com.sistema_votacion.app.models.Candidato> candidatos = candidatoRepository.findAll();
    
    // 2. Calcular el total acumulado de votos en el sistema para sacar los porcentajes
    long totalVotosGlobales = votoRepository.count();

    // 3. Mapear cada candidato con sus estadísticas calculadas
    return candidatos.stream().map(c -> {
        Map<String, Object> resultado = new HashMap<>();
        
        long votosCandidato = votoRepository.countByCandidatoId(c.getId());
        
        resultado.put("id", c.getId()); 
        resultado.put("nombre", c.getNombre());
        resultado.put("votos", votosCandidato);
        resultado.put("partidoPolitico", c.getPartidoPolitico());
        resultado.put("fotoUrl", c.getFotoUrl());
        
        // Calcular el porcentaje matemático de forma segura (evitando división por cero)
        double porcentaje = (totalVotosGlobales > 0) 
            ? ((double) votosCandidato / totalVotosGlobales) * 100 
            : 0.0;
            
        // Redondear a un decimal (ej: 33.3)
        resultado.put("porcentaje", Math.round(porcentaje * 10.0) / 10.0);
        
        return resultado;
    }).collect(Collectors.toList());
}

    @Override
    public boolean verificarSiYaVoto(String documentoVotante) {
    // Si usas el repositorio de votantes registrados:
    return votanteRegistradoRepository.existsById(documentoVotante);
    
    // O si prefieres validar directo contra la existencia en la tabla votos:
    // return votoRepository.existsByIdentificadorVotante(documentoVotante);
}
}