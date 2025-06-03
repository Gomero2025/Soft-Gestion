package com.contable.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {
    
    @NotBlank(message = "El nombre de usuario es requerido")
    private String username;
    
    @NotBlank(message = "La contraseña es requerida")
    private String password;
    
    private Boolean rememberMe = false;
}
