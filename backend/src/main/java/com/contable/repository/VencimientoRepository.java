package com.contable.repository;

import com.contable.entity.Vencimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VencimientoRepository extends JpaRepository<Vencimiento, Long> {
    
    List<Vencimiento> findByEmpresaIdAndFechaVencimientoBetweenOrderByFechaVencimiento(
        Long empresaId, LocalDate fechaDesde, LocalDate fechaHasta);
    
    @Query("SELECT v FROM Vencimiento v WHERE v.empresa.id = :empresaId " +
           "AND v.fechaVencimiento <= :fecha AND v.estado = 'PENDIENTE'")
    List<Vencimiento> findVencimientosVencidos(@Param("empresaId") Long empresaId, 
                                               @Param("fecha") LocalDate fecha);
    
    @Query("SELECT v FROM Vencimiento v WHERE v.fechaVencimiento BETWEEN :fechaDesde AND :fechaHasta " +
           "AND v.estado IN ('PENDIENTE', 'NOTIFICADO') ORDER BY v.fechaVencimiento")
    List<Vencimiento> findVencimientosProximos(@Param("fechaDesde") LocalDate fechaDesde, 
                                               @Param("fechaHasta") LocalDate fechaHasta);
}
