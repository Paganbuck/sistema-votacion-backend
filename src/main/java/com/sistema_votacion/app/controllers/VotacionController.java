package com.sistema_votacion.app.controllers;

import com.sistema_votacion.app.services.VotacionService;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/votacion")
@CrossOrigin(origins = "*")
public class VotacionController {

    @Autowired
    private VotacionService votacionService;

    // Votar enviando ID del candidato y documento del votante
    @PostMapping("/votar/{id}/{documento}")
    public ResponseEntity<?> emitirVoto(@PathVariable Long id, @PathVariable String documento) {
        return ResponseEntity.ok(votacionService.registrarVoto(id, documento));
    }

    // Consultar conteo de votos en tiempo real
    @GetMapping("/resultados")
    public ResponseEntity<?> verResultados() {
        // Retorna una lista con el nombre de cada candidato y su total de votos
        return ResponseEntity.ok(votacionService.obtenerResultados());
    }

    @GetMapping("/verificar/{documento}")
    public ResponseEntity<?> verificarVotante(@PathVariable String documento) {
    // Delegamos la verificación al servicio
    boolean yaVoto = votacionService.verificarSiYaVoto(documento);
    
    Map<String, Object> respuesta = new HashMap<>();
    if (yaVoto) {
        respuesta.put("estado", 403);
        respuesta.put("mensaje", "Usted ya ha ejercido su derecho al voto.");
    } else {
        respuesta.put("estado", 200);
        respuesta.put("mensaje", "Votante habilitado.");
    }
    return ResponseEntity.ok(respuesta);
}
}