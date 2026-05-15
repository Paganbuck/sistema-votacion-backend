package com.sistema_votacion.app.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Candidato {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String partidoPolitico; // Nuevo campo
    private String fotoUrl; // URL de la imagen (puede ser un link de internet)
}