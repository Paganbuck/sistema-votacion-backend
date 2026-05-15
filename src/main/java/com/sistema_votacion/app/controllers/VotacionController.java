package com.sistema_votacion.app.controllers;

import com.sistema_votacion.app.services.VotacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}