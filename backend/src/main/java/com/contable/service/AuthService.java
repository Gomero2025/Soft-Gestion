package com.contable.service;

import com.contable.dto.LoginRequestDTO;
import com.contable.dto.LoginResponseDTO;
import com.contable.dto.ChangePasswordDTO;
import com.contable.entity.Usuario;
import com.contable.entity.Sesion;
import com.contable.repository.UsuarioRepository;
import com.contable.repository.SesionRepository;
import com.contable.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final SesionRepository sesionRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    
    private static final int MAX_INTENTOS_FALLIDOS = 5;
    private static final int MINUTOS_BLOQUEO = 30;
    
    public LoginResponseDTO login(LoginRequestDTO loginRequest, String ipAddress, String userAgent) {
        Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));
        
        // Verificar si el usuario está bloqueado
        if (usuario.isBloqueado()) {
            throw new LockedException("Usuario bloqueado por múltiples intentos fallidos");
        }
        
        // Verificar si el usuario está activo
        if (!usuario.isActivo()) {
            throw new BadCredentialsException("Usuario inactivo");
        }
        
        try {
            // Autenticar
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            
            // Reset intentos fallidos
            usuario.setIntentosFallidos(0);
            usuario.setBloqueadoHasta(null);
            usuario.setUltimoLogin(LocalDateTime.now());
            usuarioRepository.save(usuario);
            
            // Generar token
            String token = jwtTokenProvider.generateToken(authentication);
            
            // Crear sesión
            Sesion sesion = new Sesion();
            sesion.setId(UUID.randomUUID().toString());
            sesion.setUsuario(usuario);
            sesion.setIpAddress(ipAddress);
            sesion.setUserAgent(userAgent);
            sesion.setUltimoAcceso(LocalDateTime.now());
            sesion.setExpiraEn(LocalDateTime.now().plusHours(24));
            sesion.setActiva(true);
            sesionRepository.save(sesion);
            
            // Preparar respuesta
            LoginResponseDTO response = new LoginResponseDTO();
            response.setToken(token);
            response.setUser(convertToUserDTO(usuario));
            response.setExpiresIn(jwtTokenProvider.getExpirationTime());
            
            log.info("Login exitoso para usuario: {}", usuario.getUsername());
            return response;
            
        } catch (BadCredentialsException e) {
            // Incrementar intentos fallidos
            usuario.setIntentosFallidos(usuario.getIntentosFallidos() + 1);
            
            if (usuario.getIntentosFallidos() >= MAX_INTENTOS_FALLIDOS) {
                usuario.setBloqueadoHasta(LocalDateTime.now().plusMinutes(MINUTOS_BLOQUEO));
                log.warn("Usuario {} bloqueado por {} intentos fallidos", usuario.getUsername(), MAX_INTENTOS_FALLIDOS);
            }
            
            usuarioRepository.save(usuario);
            throw new BadCredentialsException("Credenciales inválidas");
        }
    }
    
    public void logout(String username, String ipAddress) {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Desactivar sesiones activas
        sesionRepository.findByUsuarioAndActivaTrue(usuario)
            .forEach(sesion -> {
                sesion.setActiva(false);
                sesionRepository.save(sesion);
            });
        
        log.info("Logout exitoso para usuario: {}", username);
    }
    
    public LoginResponseDTO.UserDTO getCurrentUser(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return convertToUserDTO(usuario);
    }
    
    public void changePassword(String username, ChangePasswordDTO changePasswordDTO, String ipAddress) {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Verificar contraseña actual
        if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), usuario.getPasswordHash())) {
            throw new BadCredentialsException("Contraseña actual incorrecta");
        }
        
        // Validar nueva contraseña
        if (changePasswordDTO.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("La nueva contraseña debe tener al menos 8 caracteres");
        }
        
        // Actualizar contraseña
        usuario.setPasswordHash(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        usuario.setDebeCambiarPassword(false);
        usuarioRepository.save(usuario);
        
        log.info("Contraseña cambiada para usuario: {}", username);
    }
    
    public LoginResponseDTO refreshToken(String username, String ipAddress) {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Generar nuevo token
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, null);
        String token = jwtTokenProvider.generateToken(authentication);
        
        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setUser(convertToUserDTO(usuario));
        response.setExpiresIn(jwtTokenProvider.getExpirationTime());
        
        return response;
    }
    
    private LoginResponseDTO.UserDTO convertToUserDTO(Usuario usuario) {
        LoginResponseDTO.UserDTO userDTO = new LoginResponseDTO.UserDTO();
        userDTO.setId(usuario.getId());
        userDTO.setUsername(usuario.getUsername());
        userDTO.setEmail(usuario.getEmail());
        userDTO.setNombre(usuario.getNombre());
        userDTO.setApellido(usuario.getApellido());
        userDTO.setNombreCompleto(usuario.getNombreCompleto());
        userDTO.setDebeCambiarPassword(usuario.getDebeCambiarPassword());
        userDTO.setUltimoLogin(usuario.getUltimoLogin());
        
        // Agregar roles
        userDTO.setRoles(usuario.getUsuarioRoles().stream()
            .filter(ur -> ur.getActivo())
            .map(ur -> ur.getRol().getNombre())
            .toList());
        
        return userDTO;
    }
}
