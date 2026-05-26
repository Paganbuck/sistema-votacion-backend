package com.sistema_votacion.app.dtos;

public class ApiResponse<T> {
    private boolean exito;
    private String mensaje;
    private T datos;

    public ApiResponse() {}

    public ApiResponse(boolean exito, String mensaje, T datos) {
        this.exito = exito;
        this.mensaje = mensaje;
        this.datos = datos;
    }

    // Getters y Setters
    public boolean isExito() { return exito; }
    public void setExito(boolean exito) { this.exito = exito; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public T getDatos() { return datos; }
    public void setDatos(T datos) { this.datos = datos; }
}