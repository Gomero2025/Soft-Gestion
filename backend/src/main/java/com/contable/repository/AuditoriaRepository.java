package com.contable.repository;

import com.contable.entity.Auditoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {
    
    Page<Auditoria> findByUsuarioIdOrderByFechaAccionDesc(Long usuarioId, Pageable pageable);
    
    Page<Auditoria> findByEmpresaIdOrderByFechaAccionDesc(Long empresaId, Pageable pageable);
    
    @Query("SELECT a FROM Auditoria a WHERE a.tablaAfectada = :tabla AND a.registroId = :registroId ORDER BY a.fechaAccion DESC")
    List<Auditoria> findByTablaAndRegistroId(@Param("tabla") String tabla, @Param("registroId") Long registroId);
    
    @Query("SELECT a FROM Auditoria a WHERE a.empresaId = :empresaId AND a.fechaAccion BETWEEN :fechaDesde AND :fechaHasta ORDER BY a.fechaAccion DESC")
    Page<Auditoria> findByEmpresaAndFechaRange(@Param("empresaId") Long empresaId, 
                                              @Param("fechaDesde") LocalDateTime fechaDesde,
                                              @Param("fechaHasta") LocalDateTime fechaHasta,
                                              Pageable pageable);
}
