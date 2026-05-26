package com.sistema_votacion.app.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "urna_votos")
public class Voto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidato_id", nullable = false, updatable = false)
    private Long candidatoId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @Column(name = "direccion_ip", nullable = false, updatable = false)
    private String direccionIp;

    @Column(name = "user_agent", nullable = false, updatable = false)
    private String userAgent;

    @Column(name = "hash_verificacion", nullable = false, updatable = false, length = 128)
    private String hashVerificacion;

    public Voto() {}

    public Voto(Long candidatoId, LocalDateTime timestamp, String direccionIp, String userAgent, String hashVerificacion) {
        this.candidatoId = candidatoId;
        this.timestamp = timestamp;
        this.direccionIp = direccionIp;
        this.userAgent = userAgent;
        this.hashVerificacion = hashVerificacion;
    }

    public Long getId() { return id; }
    public Long getCandidatoId() { return candidatoId; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getDireccionIp() { return direccionIp; }
    public String getUserAgent() { return userAgent; }
    public String getHashVerificacion() { return hashVerificacion; }
}