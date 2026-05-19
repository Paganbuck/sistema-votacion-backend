package com.sistema_votacion.app.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class VotanteRegistrado {

    @Id
    private String documento; // Aquí se guarda la cédula como llave primaria

    private LocalDateTime fechaVoto;

    @PrePersist
    protected void onCreate() {
        this.fechaVoto = LocalDateTime.now();
    }
}