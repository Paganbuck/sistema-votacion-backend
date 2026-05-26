package com.sistema_votacion.app.services;

import java.util.List;
import java.util.Map;

public interface VotacionService {
    Object registrarVoto(Long candidatoId, String documentoVotante, String ip, String userAgent);
    List<Map<String, Object>> obtenerResultados();
    boolean verificarSiYaVoto(String documentoVotante);
}