package com.contable.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class DashboardDTO {
    private String empresa;
    private List<VencimientoDTO> vencimientosProximos;
    private IndicadoresDTO indicadores;
    private List<String> alertasInconsistencias;
    
    @Data
    public static class IndicadoresDTO {
        private BigDecimal posicionIva = BigDecimal.ZERO;
        private BigDecimal ivaDebito = BigDecimal.ZERO;
        private BigDecimal ivaCredito = BigDecimal.ZERO;
        private BigDecimal saldoIIBB = BigDecimal.ZERO;
        private BigDecimal saldoGanancias = BigDecimal.ZERO;
    }
}
