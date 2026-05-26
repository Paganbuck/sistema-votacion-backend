package com.sistema_votacion.app.services;

import com.sistema_votacion.app.models.Candidato;
import com.sistema_votacion.app.repositories.CandidatoRepository;
import com.sistema_votacion.app.repositories.VotanteRegistradoRepository;
import com.sistema_votacion.app.repositories.VotoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class VotacionServiceConcurrencyTest {

    @Autowired
    private VotacionService votacionService;

    @Autowired
    private VotanteRegistradoRepository votanteRegistradoRepository;

    @Autowired
    private VotoRepository votoRepository;

    @Autowired
    private CandidatoRepository candidatoRepository;

    private Long candidatoIdVotacion;

    @BeforeEach
    public void setUp() {
        // Limpieza explícita y manual en orden jerárquico real
        try {
            votoRepository.deleteAll();
            votanteRegistradoRepository.deleteAll();
            candidatoRepository.deleteAll();
        } catch (Exception e) {
            System.out.println("Aviso limpieza: " + e.getMessage());
        }

        // Creamos y confirmamos el candidato directamente en la base de datos real
        Candidato candidato = new Candidato();
        candidato.setNombre("Candidato Test Concurrencia");
        candidato.setPartidoPolitico("Partido de Prueba");
        candidato.setFotoUrl("https://link.com/foto.jpg");
        candidato = candidatoRepository.saveAndFlush(candidato); // Fuerza la escritura inmediata
        
        this.candidatoIdVotacion = candidato.getId();
    }

    @Test
    public void testRegistrarVotoConcurrente_MismoVotanteDeberiaVotarSoloUnaVez() throws InterruptedException {
        String documentoDuplicado = "1020304050";
        String ip = "192.168.1.50";
        String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0";
        
        int numeroDeHilosSimultaneos = 10;
        
        ExecutorService executorService = Executors.newFixedThreadPool(numeroDeHilosSimultaneos);
        CountDownLatch latch = new CountDownLatch(1);
        
        AtomicInteger votosExitosos = new AtomicInteger(0);
        AtomicInteger fraudesDetectados = new AtomicInteger(0);

        for (int i = 0; i < numeroDeHilosSimultaneos; i++) {
            executorService.execute(() -> {
                try {
                    latch.await(); // Espera la señal de salida
                    
                    votacionService.registrarVoto(candidatoIdVotacion, documentoDuplicado, ip, userAgent);
                    votosExitosos.incrementAndGet();
                    
                } catch (IllegalStateException e) {
                    // Controla la excepción de tu lógica de negocio (voto duplicado / fraude)
                    fraudesDetectados.incrementAndGet();
                } catch (Exception e) {
                    System.out.println("Excepción alternativa en hilo: " + e.getMessage());
                    fraudesDetectados.incrementAndGet();
                }
            });
        }

        // 💥 ¡FUEGO!
        latch.countDown();
        
        executorService.shutdown();
        while (!executorService.isTerminated()) {
            Thread.sleep(10);
        }

        // 📊 VERIFICACIONES:
        System.out.println("=== RESULTADOS DEL TEST DE CONCURRENCIA ===");
        System.out.println("Votos Exitosos: " + votosExitosos.get());
        System.out.println("Fraudes Detectados: " + fraudesDetectados.get());
        System.out.println("===========================================");

        assertEquals(1, votosExitosos.get(), "¡FALLA DE SEGURIDAD! Se procesó un número incorrecto de votos exitosos.");
        assertEquals(9, fraudesDetectados.get(), "¡FALLA DE CONTROL! No se contuvieron los intentos de fraude.");
        assertEquals(1, votoRepository.count(), "La urna física en base de datos guardó duplicados.");
    }
}