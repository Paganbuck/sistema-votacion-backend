package com.sistema_votacion.app.dtos;

import jakarta.validation.constraints.NotNull;

public class VotoRequest {

    @NotNull(message = "El ID del candidato seleccionado es obligatorio.")
    private Long candidatoId;

    public VotoRequest() {}

    public Long getCandidatoId() { return candidatoId; }
    public void setCandidatoId(Long candidatoId) { this.candidatoId = candidatoId; }
}