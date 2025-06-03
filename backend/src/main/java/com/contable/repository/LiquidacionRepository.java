package com.contable.repository;

import com.contable.entity.Liquidacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LiquidacionRepository extends JpaRepository<Liquidacion, Long> {
    
    @Query("SELECT COALESCE(SUM(l.impuestoDeterminado), 0) FROM Liquidacion l " +
           "WHERE l.empresa.id = :empresaId AND l.tipoImpuesto.codigo = 'IVA' " +
           "AND l.periodoFiscal.fechaDesde >= :fechaDesde AND l.periodoFiscal.fechaHasta <= :fechaHasta")
    BigDecimal getIvaDebitoMes(@Param("empresaId") Long empresaId, 
                               @Param("fechaDesde") LocalDate fechaDesde, 
                               @Param("fechaHasta") LocalDate fechaHasta);
    
    @Query("SELECT COALESCE(SUM(l.retencionesSufridas + l.percepcionesSufridas), 0) FROM Liquidacion l " +
           "WHERE l.empresa.id = :empresaId AND l.tipoImpuesto.codigo = 'IVA' " +
           "AND l.periodoFiscal.fechaDesde >= :fechaDesde AND l.periodoFiscal.fechaHasta <= :fechaHasta")
    BigDecimal getIvaCreditoMes(@Param("empresaId") Long empresaId, 
                                @Param("fechaDesde") LocalDate fechaDesde, 
                                @Param("fechaHasta") LocalDate fechaHasta);
    
    @Query("SELECT COALESCE(SUM(l.saldoAPagar - l.saldoAFavor), 0) FROM Liquidacion l " +
           "WHERE l.empresa.id = :empresaId AND l.tipoImpuesto.codigo = 'IIBB_CABA'")
    BigDecimal getSaldoIIBB(@Param("empresaId") Long empresaId);
    
    @Query("SELECT COALESCE(SUM(l.saldoAPagar - l.saldoAFavor), 0) FROM Liquidacion l " +
           "WHERE l.empresa.id = :empresaId AND l.tipoImpuesto.codigo = 'GAN'")
    BigDecimal getSaldoGanancias(@Param("empresaId") Long empresaId);
    
    List<Liquidacion> findByEmpresaIdAndEstadoOrderByFechaVencimientoAsc(Long empresaId, String estado);
}
