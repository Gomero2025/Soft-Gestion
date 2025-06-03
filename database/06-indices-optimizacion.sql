-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para auditoría y consultas frecuentes
CREATE INDEX idx_auditoria_usuario_fecha ON auditoria(usuario_id, fecha_accion);
CREATE INDEX idx_auditoria_empresa_tabla ON auditoria(empresa_id, tabla_afectada);
CREATE INDEX idx_auditoria_tabla_registro_fecha ON auditoria(tabla_afectada, registro_id, fecha_accion);

-- Índices para asientos y movimientos
CREATE INDEX idx_asientos_empresa_fecha_estado ON asientos(empresa_id, fecha, estado);
CREATE INDEX idx_movimientos_cuenta_fecha ON movimientos(cuenta_id, asiento_id);
CREATE INDEX idx_movimientos_centro_costo ON movimientos(centro_costo_id);

-- Índices para liquidaciones
CREATE INDEX idx_liquidaciones_empresa_tipo_periodo ON liquidaciones(empresa_id, tipo_impuesto_id, periodo_fiscal_id);
CREATE INDEX idx_liquidaciones_vencimiento_estado ON liquidaciones(fecha_vencimiento, estado);

-- Índices para retenciones
CREATE INDEX idx_retenciones_empresa_periodo_estado ON retenciones(empresa_id, periodo_liquidacion, estado);
CREATE INDEX idx_retenciones_proveedor_fecha ON retenciones(proveedor_cuit, fecha_retencion);
CREATE INDEX idx_percepciones_empresa_periodo ON percepciones(empresa_id, periodo_liquidacion);

-- Índices para bienes de uso
CREATE INDEX idx_bienes_uso_empresa_categoria ON bienes_uso(empresa_id, categoria_bien_id);
CREATE INDEX idx_bienes_uso_fecha_alta_estado ON bienes_uso(fecha_alta, estado);
CREATE INDEX idx_amortizaciones_bien_periodo ON amortizaciones(bien_uso_id, periodo_fiscal_id);

-- Índices para notificaciones
CREATE INDEX idx_notificaciones_empresa_fecha_estado ON notificaciones_enviadas(empresa_id, fecha_programada, estado);
CREATE INDEX idx_vencimientos_empresa_fecha_estado ON vencimientos(empresa_id, fecha_vencimiento, estado);

-- Índices para plan de cuentas
CREATE INDEX idx_plan_cuentas_empresa_codigo ON plan_cuentas(empresa_id, codigo);
CREATE INDEX idx_plan_cuentas_padre_nivel ON plan_cuentas(cuenta_padre_id, nivel);

-- Índices para configuraciones
CREATE INDEX idx_configuracion_importacion_empresa_tipo ON configuraciones_importacion(empresa_id, tipo_datos);
CREATE INDEX idx_importaciones_historico_empresa_fecha ON importaciones_historico(empresa_id, fecha_inicio);

-- =====================================================
-- VISTAS PARA CONSULTAS FRECUENTES
-- =====================================================

-- Vista para saldos de cuentas
CREATE VIEW v_saldos_cuentas AS
SELECT 
    pc.id as cuenta_id,
    pc.empresa_id,
    pc.codigo,
    pc.descripcion,
    tc.naturaleza,
    COALESCE(SUM(m.debe), 0) as total_debe,
    COALESCE(SUM(m.haber), 0) as total_haber,
    CASE 
        WHEN tc.naturaleza = 'DEUDORA' THEN COALESCE(SUM(m.debe), 0) - COALESCE(SUM(m.haber), 0)
        ELSE COALESCE(SUM(m.haber), 0) - COALESCE(SUM(m.debe), 0)
    END as saldo
FROM plan_cuentas pc
LEFT JOIN tipos_cuenta tc ON pc.tipo_cuenta_id = tc.id
LEFT JOIN movimientos m ON pc.id = m.cuenta_id
LEFT JOIN asientos a ON m.asiento_id = a.id AND a.estado = 'CONFIRMADO'
WHERE pc.activo = TRUE
GROUP BY pc.id, pc.empresa_id, pc.codigo, pc.descripcion, tc.naturaleza;

-- Vista para balance de sumas y saldos
CREATE VIEW v_balance_sumas_saldos AS
SELECT 
    e.id as empresa_id,
    e.razon_social,
    pc.codigo,
    pc.descripcion,
    tc.categoria,
    tc.naturaleza,
    COALESCE(SUM(m.debe), 0) as suma_debe,
    COALESCE(SUM(m.haber), 0) as suma_haber,
    CASE 
        WHEN tc.naturaleza = 'DEUDORA' THEN COALESCE(SUM(m.debe), 0) - COALESCE(SUM(m.haber), 0)
        ELSE COALESCE(SUM(m.haber), 0) - COALESCE(SUM(m.debe), 0)
    END as saldo_deudor,
    CASE 
        WHEN tc.naturaleza = 'ACREEDORA' THEN COALESCE(SUM(m.haber), 0) - COALESCE(SUM(m.debe), 0)
        ELSE 0
    END as saldo_acreedor
FROM empresas e
CROSS JOIN plan_cuentas pc
LEFT JOIN tipos_cuenta tc ON pc.tipo_cuenta_id = tc.id
LEFT JOIN movimientos m ON pc.id = m.cuenta_id
LEFT JOIN asientos a ON m.asiento_id = a.id AND a.estado = 'CONFIRMADO' AND a.empresa_id = e.id
WHERE e.activo = TRUE AND pc.activo = TRUE AND pc.empresa_id = e.id
GROUP BY e.id, e.razon_social, pc.id, pc.codigo, pc.descripcion, tc.categoria, tc.naturaleza
ORDER BY e.razon_social, pc.codigo;

-- Vista para vencimientos próximos
CREATE VIEW v_vencimientos_proximos AS
SELECT 
    v.id,
    v.empresa_id,
    e.razon_social,
    e.email,
    v.descripcion,
    v.fecha_vencimiento,
    v.monto_estimado,
    v.estado,
    ti.descripcion as tipo_impuesto,
    DATEDIFF(v.fecha_vencimiento, CURDATE()) as dias_restantes,
    CASE 
        WHEN DATEDIFF(v.fecha_vencimiento, CURDATE()) < 0 THEN 'VENCIDO'
        WHEN DATEDIFF(v.fecha_vencimiento, CURDATE()) <= 3 THEN 'CRITICO'
        WHEN DATEDIFF(v.fecha_vencimiento, CURDATE()) <= 7 THEN 'URGENTE'
        ELSE 'NORMAL'
    END as prioridad
FROM vencimientos v
JOIN empresas e ON v.empresa_id = e.id
JOIN tipos_impuesto ti ON v.tipo_impuesto_id = ti.id
WHERE v.estado IN ('PENDIENTE', 'NOTIFICADO')
AND e.activo = TRUE
ORDER BY v.fecha_vencimiento;

-- Vista para histórico de liquidaciones
CREATE VIEW v_historico_liquidaciones AS
SELECT 
    l.id,
    l.empresa_id,
    e.razon_social,
    pf.año,
    pf.mes,
    ti.descripcion as tipo_impuesto,
    l.base_imponible,
    l.impuesto_determinado,
    l.saldo_a_pagar,
    l.saldo_a_favor,
    l.fecha_vencimiento,
    l.estado,
    l.fecha_presentacion,
    l.numero_presentacion
FROM liquidaciones l
JOIN empresas e ON l.empresa_id = e.id
JOIN periodos_fiscales pf ON l.periodo_fiscal_id = pf.id
JOIN tipos_impuesto ti ON l.tipo_impuesto_id = ti.id
WHERE e.activo = TRUE
ORDER BY e.razon_social, pf.año DESC, pf.mes DESC, ti.descripcion;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

DELIMITER //

-- Procedimiento para calcular amortizaciones
CREATE PROCEDURE sp_calcular_amortizaciones(
    IN p_empresa_id INT,
    IN p_periodo_fiscal_id INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_bien_id INT;
    DECLARE v_valor_origen DECIMAL(15,2);
    DECLARE v_porcentaje DECIMAL(5,2);
    DECLARE v_amortizacion_acumulada DECIMAL(15,2);
    DECLARE v_amortizacion_periodo DECIMAL(15,2);
    
    DECLARE cur_bienes CURSOR FOR
        SELECT id, valor_origen, porcentaje_amortizacion, amortizacion_acumulada
        FROM bienes_uso
        WHERE empresa_id = p_empresa_id 
        AND estado = 'ACTIVO'
        AND fecha_alta <= (SELECT fecha_hasta FROM periodos_fiscales WHERE id = p_periodo_fiscal_id);
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur_bienes;
    
    read_loop: LOOP
        FETCH cur_bienes INTO v_bien_id, v_valor_origen, v_porcentaje, v_amortizacion_acumulada;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Calcular amortización del período
        SET v_amortizacion_periodo = v_valor_origen * v_porcentaje / 100 / 12;
        
        -- Insertar registro de amortización
        INSERT INTO amortizaciones (
            bien_uso_id, periodo_fiscal_id, fecha_calculo,
            valor_origen, amortizacion_periodo, 
            amortizacion_acumulada_anterior, amortizacion_acumulada_nueva,
            valor_neto_anterior, valor_neto_nuevo,
            dias_periodo, porcentaje_aplicado, created_by
        ) VALUES (
            v_bien_id, p_periodo_fiscal_id, CURDATE(),
            v_valor_origen, v_amortizacion_periodo,
            v_amortizacion_acumulada, v_amortizacion_acumulada + v_amortizacion_periodo,
            v_valor_origen - v_amortizacion_acumulada, 
            v_valor_origen - (v_amortizacion_acumulada + v_amortizacion_periodo),
            30, v_porcentaje, 1
        );
        
        -- Actualizar bien de uso
        UPDATE bienes_uso 
        SET amortizacion_acumulada = v_amortizacion_acumulada + v_amortizacion_periodo
        WHERE id = v_bien_id;
        
    END LOOP;
    
    CLOSE cur_bienes;
END //

-- Procedimiento para generar vencimientos automáticos
CREATE PROCEDURE sp_generar_vencimientos_automaticos(
    IN p_año INT,
    IN p_mes INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_empresa_id INT;
    DECLARE v_cuit VARCHAR(13);
    DECLARE v_ultimo_digito INT;
    DECLARE v_fecha_vencimiento DATE;
    
    DECLARE cur_empresas CURSOR FOR
        SELECT id, cuit FROM empresas WHERE activo = TRUE;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur_empresas;
    
    read_loop: LOOP
        FETCH cur_empresas INTO v_empresa_id, v_cuit;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Obtener último dígito del CUIT
        SET v_ultimo_digito = CAST(RIGHT(REPLACE(v_cuit, '-', ''), 1) AS UNSIGNED);
        
        -- Calcular fecha de vencimiento IVA según último dígito
        CASE v_ultimo_digito
            WHEN 0, 1 THEN SET v_fecha_vencimiento = DATE(CONCAT(p_año, '-', LPAD(p_mes + 1, 2, '0'), '-16'));
            WHEN 2, 3 THEN SET v_fecha_vencimiento = DATE(CONCAT(p_año, '-', LPAD(p_mes + 1, 2, '0'), '-17'));
            WHEN 4, 5 THEN SET v_fecha_vencimiento = DATE(CONCAT(p_año, '-', LPAD(p_mes + 1, 2, '0'), '-18'));
            WHEN 6, 7 THEN SET v_fecha_vencimiento = DATE(CONCAT(p_año, '-', LPAD(p_mes + 1, 2, '0'), '-19'));
            WHEN 8, 9 THEN SET v_fecha_vencimiento = DATE(CONCAT(p_año, '-', LPAD(p_mes + 1, 2, '0'), '-20'));
        END CASE;
        
        -- Insertar vencimiento IVA
        INSERT INTO vencimientos (empresa_id, tipo_impuesto_id, descripcion, fecha_vencimiento)
        VALUES (v_empresa_id, 1, CONCAT('IVA ', p_año, '-', LPAD(p_mes, 2, '0')), v_fecha_vencimiento);
        
    END LOOP;
    
    CLOSE cur_empresas;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- =====================================================

DELIMITER //

-- Trigger para auditoría de empresas
CREATE TRIGGER tr_empresas_audit_insert
AFTER INSERT ON empresas
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (usuario_id, empresa_id, tabla_afectada, registro_id, accion, datos_nuevos, fecha_accion)
    VALUES (NEW.created_by, NEW.id, 'empresas', NEW.id, 'INSERT', 
            JSON_OBJECT('razon_social', NEW.razon_social, 'cuit', NEW.cuit), NOW());
END //

CREATE TRIGGER tr_empresas_audit_update
AFTER UPDATE ON empresas
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (usuario_id, empresa_id, tabla_afectada, registro_id, accion, datos_anteriores, datos_nuevos, fecha_accion)
    VALUES (NEW.created_by, NEW.id, 'empresas', NEW.id, 'UPDATE',
            JSON_OBJECT('razon_social', OLD.razon_social, 'cuit', OLD.cuit),
            JSON_OBJECT('razon_social', NEW.razon_social, 'cuit', NEW.cuit), NOW());
END //

-- Trigger para auditoría de asientos
CREATE TRIGGER tr_asientos_audit_insert
AFTER INSERT ON asientos
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (usuario_id, empresa_id, tabla_afectada, registro_id, accion, datos_nuevos, fecha_accion)
    VALUES (NEW.created_by, NEW.empresa_id, 'asientos', NEW.id, 'INSERT',
            JSON_OBJECT('numero', NEW.numero, 'fecha', NEW.fecha, 'descripcion', NEW.descripcion), NOW());
END //

CREATE TRIGGER tr_asientos_audit_update
AFTER UPDATE ON asientos
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (usuario_id, empresa_id, tabla_afectada, registro_id, accion, datos_anteriores, datos_nuevos, fecha_accion)
    VALUES (COALESCE(NEW.confirmado_por, NEW.anulado_por, NEW.created_by), NEW.empresa_id, 'asientos', NEW.id, 'UPDATE',
            JSON_OBJECT('estado', OLD.estado, 'total_debe', OLD.total_debe, 'total_haber', OLD.total_haber),
            JSON_OBJECT('estado', NEW.estado, 'total_debe', NEW.total_debe, 'total_haber', NEW.total_haber), NOW());
END //

DELIMITER ;
