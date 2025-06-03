package com.contable.service;

import com.contable.entity.Auditoria;
import com.contable.repository.AuditoriaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditoriaService {
    
    private final AuditoriaRepository auditoriaRepository;
    private final ObjectMapper objectMapper;
    
    @Transactional
    public void registrarAccion(Long usuarioId, Long empresaId, String tablaAfectada, 
                               Long registroId, String accion, Object datosAnteriores, 
                               Object datosNuevos, String ipAddress, String userAgent) {
        try {
            Auditoria auditoria = new Auditoria();
            auditoria.setUsuarioId(usuarioId);
            auditoria.setEmpresaId(empresaId);
            auditoria.setTablaAfectada(tablaAfectada);
            auditoria.setRegistroId(registroId);
            auditoria.setAccion(accion);
            auditoria.setIpAddress(ipAddress);
            auditoria.setUserAgent(userAgent);
            auditoria.setFechaAccion(LocalDateTime.now());
            
            if (datosAnteriores != null) {
                auditoria.setDatosAnteriores(objectMapper.writeValueAsString(datosAnteriores));
            }
            
            if (datosNuevos != null) {
                auditoria.setDatosNuevos(objectMapper.writeValueAsString(datosNuevos));
            }
            
            auditoriaRepository.save(auditoria);
            
        } catch (Exception e) {
            log.error("Error al registrar auditoría: {}", e.getMessage(), e);
        }
    }
    
    @Transactional
    public void registrarCreacion(Long usuarioId, Long empresaId, String tabla, 
                                 Long registroId, Object datos, String ipAddress) {
        registrarAccion(usuarioId, empresaId, tabla, registroId, "INSERT", 
                       null, datos, ipAddress, null);
    }
    
    @Transactional
    public void registrarModificacion(Long usuarioId, Long empresaId, String tabla, 
                                     Long registroId, Object datosAnteriores, 
                                     Object datosNuevos, String ipAddress) {
        registrarAccion(usuarioId, empresaId, tabla, registroId, "UPDATE", 
                       datosAnteriores, datosNuevos, ipAddress, null);
    }
    
    @Transactional
    public void registrarEliminacion(Long usuarioId, Long empresaId, String tabla, 
                                    Long registroId, Object datos, String ipAddress) {
        registrarAccion(usuarioId, empresaId, tabla, registroId, "DELETE", 
                       datos, null, ipAddress, null);
    }
}
