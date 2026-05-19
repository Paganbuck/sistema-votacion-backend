package com.sistema_votacion.app.controllers;

import com.sistema_votacion.app.services.VotacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/votacion")
@CrossOrigin(origins = "*")
public class VotacionController {

    @Autowired
    private VotacionService votacionService;

    // 1. VALIDACIÓN PREVENTIVA: Bloquea al votante en el login si ya ejerció su derecho
    @GetMapping("/verificar/{documento}")
    public ResponseEntity<?> verificarVotante(@PathVariable String documento) {
        boolean yaVoto = votacionService.verificarSiYaVoto(documento);
        
        Map<String, Object> respuesta = new HashMap<>();
        if (yaVoto) {
            respuesta.put("estado", 403);
            respuesta.put("mensaje", "Usted ya ha ejercido su derecho al voto.");
        } else {
            respuesta.put("estado", 200);
            respuesta.put("mensaje", "Votante habilitado para ingresar al tarjetón.");
        }
        return ResponseEntity.ok(respuesta);
    }

    // 2. PROCESAR VOTO: Registra la cédula en control y crea el voto anónimo
    @PostMapping("/votar/{idCandidato}/{documento}")
    public ResponseEntity<?> emitirVoto(@PathVariable Long idCandidato, @PathVariable String documento) {
        try {
            Object resultado = votacionService.registrarVoto(idCandidato, documento);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("estado", 400);
            error.put("mensaje", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 3. RESULTADOS: Consulta el conteo en tiempo real
    @GetMapping("/resultados")
    public ResponseEntity<List<Map<String, Object>>> verResultados() {
        return ResponseEntity.ok(votacionService.obtenerResultados());
    }
}