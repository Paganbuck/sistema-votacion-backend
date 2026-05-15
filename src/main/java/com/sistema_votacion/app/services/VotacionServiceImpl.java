package com.sistema_votacion.app.services;

import com.sistema_votacion.app.models.Voto;
import com.sistema_votacion.app.repositories.CandidatoRepository;
import com.sistema_votacion.app.repositories.VotoRepository;
import com.sistema_votacion.app.utils.ApiResponse;
import com.sistema_votacion.app.utils.HashUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class VotacionServiceImpl implements VotacionService {

    @Autowired
    private CandidatoRepository candidatoRepository;

    @Autowired
    private VotoRepository votoRepository;

    @Override
    public Object registrarVoto(Long candidatoId, String documentoVotante) {
        // 1. Validar duplicidad - Lanzamos excepción si ya existe
        if (votoRepository.existsByIdentificadorVotante(documentoVotante)) {
            throw new RuntimeException("Usted ya ha ejercido su derecho al voto.");
        }

        return candidatoRepository.findById(candidatoId).map(candidato -> {
            Voto nuevoVoto = new Voto();
            nuevoVoto.setCandidato(candidato);
            nuevoVoto.setIdentificadorVotante(documentoVotante);
            
            String datosParaHash = documentoVotante + "-" + candidato.getId() + "-" + System.currentTimeMillis();
            nuevoVoto.setHashIntegridad(HashUtil.generarSHA512(datosParaHash));
            
            votoRepository.save(nuevoVoto);
            return new ApiResponse("Voto registrado con éxito", 200, candidato.getNombre());
        }).orElseThrow(() -> new RuntimeException("El candidato no existe en el sistema."));
    }
    
    @Override
    public List<Map<String, Object>> obtenerResultados() {
        return candidatoRepository.findAll().stream().map(c -> {
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("nombre", c.getNombre());
            resultado.put("votos", votoRepository.countByCandidatoId(c.getId()));
            return resultado;
        }).collect(Collectors.toList());
    }
}