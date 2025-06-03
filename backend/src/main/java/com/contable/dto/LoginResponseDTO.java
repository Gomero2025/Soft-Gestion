package com.contable.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class LoginResponseDTO {
    private String token;
    private UserDTO user;
    private Long expiresIn;
    
    @Data
    public static class UserDTO {
        private Long id;
        private String username;
        private String email;
        private String nombre;
        private String apellido;
        private String nombreCompleto;
        private Boolean debeCambiarPassword;
        private LocalDateTime ultimoLogin;
        private List<String> roles;
    }
}
