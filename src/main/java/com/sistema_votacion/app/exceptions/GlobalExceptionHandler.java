package com.sistema_votacion.app.exceptions;

import com.sistema_votacion.app.utils.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> manejarRuntime(RuntimeException e) {
        ApiResponse respuesta = new ApiResponse(e.getMessage(), HttpStatus.BAD_REQUEST.value(), null);
        return new ResponseEntity<>(respuesta, HttpStatus.BAD_REQUEST);
    }

    // Por si ocurre un error inesperado de sistema
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> manejarGeneral(Exception e) {
        ApiResponse respuesta = new ApiResponse("Error interno del servidor", HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
        return new ResponseEntity<>(respuesta, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}