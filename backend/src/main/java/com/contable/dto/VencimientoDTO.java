package com.contable.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class VencimientoDTO {
    private Long id;
    private String descripcion;
    private LocalDate fechaVencimiento;
    private BigDecimal montoEstimado;
    private String estado;
    private String tipoImpuesto;
    private Long diasRestantes;
}
