package com.sistema_votacion.app.utils;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse {
    private String mensaje;
    private int estado;
    private Object data; // Aquí puede ir cualquier cosa (votos, resultados, etc.)
}