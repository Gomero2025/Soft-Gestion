package com.contable.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "auditoria")
public class Auditoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    
    @Column(name = "empresa_id")
    private Long empresaId;
    
    @Column(name = "tabla_afectada", nullable = false, length = 50)
    private String tablaAfectada;
    
    @Column(name = "registro_id", nullable = false)
    private Long registroId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "accion", nullable = false)
    private AccionAuditoria accion;
    
    @Column(name = "datos_anteriores", columnDefinition = "JSON")
    private String datosAnteriores;
    
    @Column(name = "datos_nuevos", columnDefinition = "JSON")
    private String datosNuevos;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "fecha_accion", nullable = false)
    private LocalDateTime fechaAccion;
    
    public enum AccionAuditoria {
        INSERT, UPDATE, DELETE, SELECT
    }
}
