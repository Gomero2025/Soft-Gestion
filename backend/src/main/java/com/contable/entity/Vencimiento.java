package com.contable.entity;

import com.contable.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "vencimientos")
public class Vencimiento extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_impuesto_id", nullable = false)
    private TipoImpuesto tipoImpuesto;
    
    @Column(name = "descripcion", nullable = false)
    private String descripcion;
    
    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;
    
    @Column(name = "monto_estimado", precision = 15, scale = 2)
    private BigDecimal montoEstimado;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoVencimiento estado = EstadoVencimiento.PENDIENTE;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "liquidacion_id")
    private Liquidacion liquidacion;
    
    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
    
    public enum EstadoVencimiento {
        PENDIENTE, NOTIFICADO, CUMPLIDO, VENCIDO
    }
}
