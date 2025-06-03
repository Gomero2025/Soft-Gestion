package com.contable.service;

import com.contable.dto.DashboardDTO;
import com.contable.dto.VencimientoDTO;
import com.contable.entity.Empresa;
import com.contable.entity.Liquidacion;
import com.contable.entity.Vencimiento;
import com.contable.repository.EmpresaRepository;
import com.contable.repository.LiquidacionRepository;
import com.contable.repository.VencimientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {
    
    private final EmpresaRepository empresaRepository;
    private final VencimientoRepository vencimientoRepository;
    private final LiquidacionRepository liquidacionRepository;
    
    public DashboardDTO getDashboardData(Long empresaId) {
        Empresa empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        
        DashboardDTO dashboard = new DashboardDTO();
        dashboard.setEmpresa(empresa.getDisplayName());
        dashboard.setVencimientosProximos(getVencimientosProximos(empresaId, 15));
        dashboard.setIndicadores(getIndicadoresFiscales(empresaId));
        dashboard.setAlertasInconsistencias(getAlertasInconsistencias(empresaId));
        
        return dashboard;
    }
    
    public List<VencimientoDTO> getVencimientosProximos(Long empresaId, int dias) {
        LocalDate fechaLimite = LocalDate.now().plusDays(dias);
        List<Vencimiento> vencimientos = vencimientoRepository
            .findByEmpresaIdAndFechaVencimientoBetweenOrderByFechaVencimiento(
                empresaId, LocalDate.now(), fechaLimite);
        
        return vencimientos.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public DashboardDTO.IndicadoresDTO getIndicadoresFiscales(Long empresaId) {
        DashboardDTO.IndicadoresDTO indicadores = new DashboardDTO.IndicadoresDTO();
        
        // Calcular posición IVA del mes actual
        LocalDate inicioMes = LocalDate.now().withDayOfMonth(1);
        LocalDate finMes = inicioMes.plusMonths(1).minusDays(1);
        
        BigDecimal ivaDebito = liquidacionRepository.getIvaDebitoMes(empresaId, inicioMes, finMes);
        BigDecimal ivaCredito = liquidacionRepository.getIvaCreditoMes(empresaId, inicioMes, finMes);
        
        indicadores.setPosicionIva(ivaDebito.subtract(ivaCredito));
        indicadores.setIvaDebito(ivaDebito);
        indicadores.setIvaCredito(ivaCredito);
        
        // Calcular saldos de impuestos
        indicadores.setSaldoIIBB(liquidacionRepository.getSaldoIIBB(empresaId));
        indicadores.setSaldoGanancias(liquidacionRepository.getSaldoGanancias(empresaId));
        
        return indicadores;
    }
    
    private List<String> getAlertasInconsistencias(Long empresaId) {
        // Implementar lógica de detección de inconsistencias
        return List.of();
    }
    
    private VencimientoDTO convertToDTO(Vencimiento vencimiento) {
        VencimientoDTO dto = new VencimientoDTO();
        dto.setId(vencimiento.getId());
        dto.setDescripcion(vencimiento.getDescripcion());
        dto.setFechaVencimiento(vencimiento.getFechaVencimiento());
        dto.setMontoEstimado(vencimiento.getMontoEstimado());
        dto.setEstado(vencimiento.getEstado().toString());
        dto.setTipoImpuesto(vencimiento.getTipoImpuesto().getDescripcion());
        dto.setDiasRestantes(LocalDate.now().until(vencimiento.getFechaVencimiento()).getDays());
        return dto;
    }
}
