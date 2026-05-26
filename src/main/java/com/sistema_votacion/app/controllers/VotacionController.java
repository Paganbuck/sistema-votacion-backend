package com.sistema_votacion.app.controllers;

import com.sistema_votacion.app.models.Candidato;
import com.sistema_votacion.app.repositories.CandidatoRepository;
import com.sistema_votacion.app.services.VotacionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    // Inyectamos el repositorio para la persistencia directa de nuevos candidatos
    @Autowired
    private CandidatoRepository candidatoRepository;

    // 1. VALIDACIÓN PREVENTIVA
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

    // 2. PROCESAR VOTO (Con extracción forense automatizada)
    @PostMapping("/votar/{idCandidato}/{documento}")
    public ResponseEntity<?> emitirVoto(
            @PathVariable Long idCandidato, 
            @PathVariable String documento,
            HttpServletRequest request) {
        
        // Capturar IP del cliente y el identificador de su navegador
        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");

        // Enviar la petición enriquecida con los metadatos de auditoría
        Object resultado = votacionService.registrarVoto(idCandidato, documento, ip, userAgent);
        return ResponseEntity.ok(resultado);
    }

    // 3. RESULTADOS
    @GetMapping("/resultados")
    public ResponseEntity<List<Map<String, Object>>> verResultados() {
        return ResponseEntity.ok(votacionService.obtenerResultados());
    }

    // 🆕 4. CREACIÓN DE CANDIDATOS (Evita inserciones manuales en MySQL)
    @PostMapping("/candidatos")
    public ResponseEntity<?> crearCandidato(@RequestBody Candidato candidato) {
        Map<String, String> respuesta = new HashMap<>();
        
        // Validación diáfana de negocio directamente en el servidor
        if (candidato.getNombre() == null || candidato.getNombre().trim().isEmpty()) {
            respuesta.put("mensaje", "El nombre del candidato es estrictamente obligatorio.");
            return ResponseEntity.badRequest().body(respuesta);
        }
        
        if (candidato.getPartidoPolitico() == null || candidato.getPartidoPolitico().trim().isEmpty()) {
            respuesta.put("mensaje", "El partido político del candidato es obligatorio.");
            return ResponseEntity.badRequest().body(respuesta);
        }

        // Persistencia directa y segura
        Candidato nuevoCandidato = candidatoRepository.save(candidato);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCandidato);
    }

    // 🆕 5. LOGIN SEGURO DEL ADMINISTRADOR (Saca el secreto '999999' de React)
    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> credenciales) {
        String claveIngresada = credenciales.get("clave");
        String claveCorrecta = "999999"; // Resguardada de forma perimetral en el backend

        Map<String, Object> respuesta = new HashMap<>();
        
        if (claveCorrecta.equals(claveIngresada)) {
            respuesta.put("autorizado", true);
            respuesta.put("mensaje", "Acceso concedido al módulo de escrutinio y auditoría.");
            return ResponseEntity.ok(respuesta);
        } else {
            respuesta.put("autorizado", false);
            respuesta.put("mensaje", "Credenciales de administrador inválidas. Intento registrado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(respuesta);
        }
    }
}