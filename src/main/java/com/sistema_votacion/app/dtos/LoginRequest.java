package com.sistema_votacion.app.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class LoginRequest {

    @NotBlank(message = "El documento de identidad es obligatorio.")
    @Size(min = 6, max = 12, message = "El documento debe tener entre 6 y 12 caracteres.")
    @Pattern(regexp = "^[0-9]+$", message = "El documento debe contener únicamente caracteres numéricos.")
    private String documentoVotante;

    // Constructor, Getters y Setters
    public LoginRequest() {}

    public String getDocumentoVotante() { return documentoVotante; }
    public void setDocumentoVotante(String documentoVotante) { this.documentoVotante = documentoVotante; }
}