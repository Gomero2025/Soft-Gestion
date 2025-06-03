package com.contable.controller;

import com.contable.dto.LoginRequestDTO;
import com.contable.dto.LoginResponseDTO;
import com.contable.dto.ChangePasswordDTO;
import com.contable.service.AuthService;
import com.contable.service.AuditoriaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final AuditoriaService auditoriaService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest,
                                                 HttpServletRequest request) {
        try {
            LoginResponseDTO response = authService.login(loginRequest, getClientIP(request), getUserAgent(request));
            
            // Registrar login exitoso
            auditoriaService.registrarAccion(
                response.getUser().getId(), 
                null, 
                "usuarios", 
                response.getUser().getId(), 
                "LOGIN_SUCCESS", 
                null, 
                loginRequest, 
                getClientIP(request), 
                getUserAgent(request)
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            // Registrar intento fallido
            auditoriaService.registrarAccion(
                null, 
                null, 
                "usuarios", 
                null, 
                "LOGIN_FAILED", 
                null, 
                loginRequest.getUsername(), 
                getClientIP(request), 
                getUserAgent(request)
            );
            throw e;
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(Authentication authentication, HttpServletRequest request) {
        if (authentication != null) {
            authService.logout(authentication.getName(), getClientIP(request));
        }
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/verify")
    public ResponseEntity<LoginResponseDTO.UserDTO> verifyToken(Authentication authentication) {
        LoginResponseDTO.UserDTO user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO,
                                              Authentication authentication,
                                              HttpServletRequest request) {
        authService.changePassword(authentication.getName(), changePasswordDTO, getClientIP(request));
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refreshToken(Authentication authentication,
                                                        HttpServletRequest request) {
        LoginResponseDTO response = authService.refreshToken(authentication.getName(), getClientIP(request));
        return ResponseEntity.ok(response);
    }
    
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
    
    private String getUserAgent(HttpServletRequest request) {
        return request.getHeader("User-Agent");
    }
}
