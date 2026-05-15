package com.sistema_votacion.app.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Voto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne 
    @JoinColumn(name = "candidato_id", nullable = false)
    private Candidato candidato;

    // Este es el campo clave para evitar fraude
    @Column(unique = true, nullable = false) 
    private String identificadorVotante;

    private LocalDateTime fechaVoto;

    @Column(length = 128) 
    private String hashIntegridad;

    @PrePersist 
    protected void onCreate() {
        this.fechaVoto = LocalDateTime.now();
    }
}