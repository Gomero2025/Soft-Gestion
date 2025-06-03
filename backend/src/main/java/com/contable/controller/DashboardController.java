package com.contable.controller;

import com.contable.dto.DashboardDTO;
import com.contable.dto.VencimientoDTO;
import com.contable.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    @GetMapping("/{empresaId}")
    @PreAuthorize("hasPermission(#empresaId, 'EMPRESA', 'READ')")
    public ResponseEntity<DashboardDTO> getDashboard(@PathVariable Long empresaId) {
        DashboardDTO dashboard = dashboardService.getDashboardData(empresaId);
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/{empresaId}/vencimientos")
    @PreAuthorize("hasPermission(#empresaId, 'EMPRESA', 'READ')")
    public ResponseEntity<List<VencimientoDTO>> getVencimientos(@PathVariable Long empresaId,
                                                               @RequestParam(defaultValue = "30") int dias) {
        List<VencimientoDTO> vencimientos = dashboardService.getVencimientosProximos(empresaId, dias);
        return ResponseEntity.ok(vencimientos);
    }
    
    @GetMapping("/{empresaId}/indicadores")
    @PreAuthorize("hasPermission(#empresaId, 'EMPRESA', 'READ')")
    public ResponseEntity<DashboardDTO.IndicadoresDTO> getIndicadores(@PathVariable Long empresaId) {
        DashboardDTO.IndicadoresDTO indicadores = dashboardService.getIndicadoresFiscales(empresaId);
        return ResponseEntity.ok(indicadores);
    }
}
