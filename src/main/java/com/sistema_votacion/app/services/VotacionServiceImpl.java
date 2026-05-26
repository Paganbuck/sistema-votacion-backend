package com.sistema_votacion.app.services;

import com.sistema_votacion.app.models.Voto;
import com.sistema_votacion.app.models.VotanteRegistrado;
import com.sistema_votacion.app.repositories.CandidatoRepository;
import com.sistema_votacion.app.repositories.VotoRepository;
import com.sistema_votacion.app.repositories.VotanteRegistradoRepository;
import com.sistema_votacion.app.dtos.ApiResponse;
import com.sistema_votacion.app.utils.HashUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;
import java.time.LocalDateTime;
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
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public synchronized Object registrarVoto(Long candidatoId, String documentoVotante, String ip, String userAgent) {
        
        // 1. VERIFICACIÓN CRÍTICA EN BASE DE DATOS (Doble voto)
        if (votanteRegistradoRepository.existsById(documentoVotante)) {
            throw new IllegalStateException("Intento de fraude detectado: El ciudadano ya ejerció su derecho al voto.");
        }

        // 2. VALIDAR EXISTENCIA DEL CANDIDATO
        return candidatoRepository.findById(candidatoId).map(candidato -> {
            
            // A) Registrar consumo inmediato del derecho al voto
            VotanteRegistrado votante = new VotanteRegistrado();
            votante.setDocumento(documentoVotante);
            votanteRegistradoRepository.save(votante);

            // B) Sellar metadatos y calcular hash criptográfico SHA-512
            LocalDateTime horaActual = LocalDateTime.now();
            String datosParaHash = candidatoId + "-" + ip + "-" + userAgent + "-" + horaActual.toString();
            String hashUrna = HashUtil.generarSHA512(datosParaHash);

            // C) Depositar sufragio inmutable de forma anónima en la urna
            Voto nuevoVoto = new Voto(candidatoId, horaActual, ip, userAgent, hashUrna);
            votoRepository.save(nuevoVoto);
            
            return new ApiResponse<>(true, "Voto registrado con éxito.", candidato.getNombre());
            
        }).orElseThrow(() -> new IllegalArgumentException("El candidato no existe en el sistema."));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> obtenerResultados() {
        List<com.sistema_votacion.app.models.Candidato> candidatos = candidatoRepository.findAll();
        long totalVotosGlobales = votoRepository.count();

        return candidatos.stream().map(c -> {
            Map<String, Object> resultado = new HashMap<>();
            long votosCandidato = votoRepository.countByCandidatoId(c.getId());
            
            resultado.put("id", c.getId()); 
            resultado.put("nombre", c.getNombre());
            resultado.put("votos", votosCandidato);
            resultado.put("partidoPolitico", c.getPartidoPolitico());
            resultado.put("fotoUrl", c.getFotoUrl());
            
            double porcentaje = (totalVotosGlobales > 0) 
                ? ((double) votosCandidato / totalVotosGlobales) * 100 
                : 0.0;
                
            resultado.put("porcentaje", Math.round(porcentaje * 10.0) / 10.0);
            
            return resultado;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean verificarSiYaVoto(String documentoVotante) {
        return votanteRegistradoRepository.existsById(documentoVotante);
    }
}