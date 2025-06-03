-- =====================================================
-- MÓDULO DE IMPUESTOS Y LIQUIDACIONES
-- =====================================================

-- Tipos de impuesto
CREATE TABLE tipos_impuesto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    jurisdiccion_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (jurisdiccion_id) REFERENCES jurisdicciones(id)
);

-- Alícuotas de impuestos
CREATE TABLE alicuotas_impuesto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_impuesto_id INT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    porcentaje DECIMAL(5,2) NOT NULL,
    fecha_desde DATE NOT NULL,
    fecha_hasta DATE NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (tipo_impuesto_id) REFERENCES tipos_impuesto(id),
    INDEX idx_tipo_fecha (tipo_impuesto_id, fecha_desde, fecha_hasta)
);

-- Períodos fiscales
CREATE TABLE periodos_fiscales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    año INT NOT NULL,
    mes INT NOT NULL,
    fecha_desde DATE NOT NULL,
    fecha_hasta DATE NOT NULL,
    estado ENUM('ABIERTO', 'CERRADO', 'AJUSTADO') DEFAULT 'ABIERTO',
    fecha_cierre TIMESTAMP NULL,
    cerrado_por INT NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (cerrado_por) REFERENCES usuarios(id),
    UNIQUE KEY unique_empresa_periodo (empresa_id, año, mes),
    INDEX idx_empresa_fecha (empresa_id, fecha_desde, fecha_hasta)
);

-- Liquidaciones de impuestos
CREATE TABLE liquidaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    periodo_fiscal_id INT NOT NULL,
    tipo_impuesto_id INT NOT NULL,
    base_imponible DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    impuesto_determinado DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    saldo_anterior DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    pagos_cuenta DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    retenciones_sufridas DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    percepciones_sufridas DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    saldo_a_favor DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    saldo_a_pagar DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    fecha_vencimiento DATE NOT NULL,
    estado ENUM('BORRADOR', 'PRESENTADA', 'PAGADA') DEFAULT 'BORRADOR',
    numero_presentacion VARCHAR(50),
    fecha_presentacion TIMESTAMP NULL,
    fecha_pago TIMESTAMP NULL,
    observaciones TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (periodo_fiscal_id) REFERENCES periodos_fiscales(id),
    FOREIGN KEY (tipo_impuesto_id) REFERENCES tipos_impuesto(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    UNIQUE KEY unique_empresa_periodo_impuesto (empresa_id, periodo_fiscal_id, tipo_impuesto_id),
    INDEX idx_vencimiento (fecha_vencimiento),
    INDEX idx_estado (estado)
);

-- Histórico de liquidaciones
CREATE TABLE liquidaciones_historico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    liquidacion_id INT NOT NULL,
    campo_modificado VARCHAR(50) NOT NULL,
    valor_anterior DECIMAL(15,2),
    valor_nuevo DECIMAL(15,2),
    usuario_id INT NOT NULL,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (liquidacion_id) REFERENCES liquidaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_liquidacion_fecha (liquidacion_id, fecha_modificacion)
);

-- Detalle de liquidaciones IVA
CREATE TABLE liquidaciones_iva_detalle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    liquidacion_id INT NOT NULL,
    tipo ENUM('DEBITO', 'CREDITO') NOT NULL,
    alicuota_id INT NOT NULL,
    base_imponible DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    impuesto DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (liquidacion_id) REFERENCES liquidaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (alicuota_id) REFERENCES alicuotas_impuesto(id),
    INDEX idx_liquidacion_tipo (liquidacion_id, tipo)
);

-- =====================================================
-- MÓDULO DE RETENCIONES Y PERCEPCIONES
-- =====================================================

-- Regímenes de retención
CREATE TABLE regimenes_retencion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NOT NULL,
    tipo_impuesto_id INT NOT NULL,
    porcentaje_retencion DECIMAL(5,2) NOT NULL,
    minimo_no_imponible DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    fecha_desde DATE NOT NULL,
    fecha_hasta DATE NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (tipo_impuesto_id) REFERENCES tipos_impuesto(id),
    INDEX idx_codigo_fecha (codigo, fecha_desde, fecha_hasta)
);

-- Retenciones realizadas
CREATE TABLE retenciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    proveedor_cuit VARCHAR(13) NOT NULL,
    proveedor_razon_social VARCHAR(255) NOT NULL,
    regimen_retencion_id INT NOT NULL,
    numero_certificado VARCHAR(50) NOT NULL,
    fecha_retencion DATE NOT NULL,
    periodo_liquidacion VARCHAR(7) NOT NULL, -- YYYY-MM
    base_imponible DECIMAL(15,2) NOT NULL,
    porcentaje_aplicado DECIMAL(5,2) NOT NULL,
    importe_retenido DECIMAL(15,2) NOT NULL,
    comprobante_origen VARCHAR(100),
    estado ENUM('ACTIVA', 'ANULADA') DEFAULT 'ACTIVA',
    fecha_anulacion TIMESTAMP NULL,
    motivo_anulacion TEXT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (regimen_retencion_id) REFERENCES regimenes_retencion(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    UNIQUE KEY unique_empresa_certificado (empresa_id, numero_certificado),
    INDEX idx_empresa_periodo (empresa_id, periodo_liquidacion),
    INDEX idx_proveedor_cuit (proveedor_cuit),
    INDEX idx_fecha (fecha_retencion)
);

-- Percepciones sufridas
CREATE TABLE percepciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    agente_cuit VARCHAR(13) NOT NULL,
    agente_razon_social VARCHAR(255) NOT NULL,
    tipo_impuesto_id INT NOT NULL,
    numero_comprobante VARCHAR(50) NOT NULL,
    fecha_percepcion DATE NOT NULL,
    periodo_liquidacion VARCHAR(7) NOT NULL, -- YYYY-MM
    base_imponible DECIMAL(15,2) NOT NULL,
    porcentaje_aplicado DECIMAL(5,2) NOT NULL,
    importe_percibido DECIMAL(15,2) NOT NULL,
    estado ENUM('ACTIVA', 'ANULADA') DEFAULT 'ACTIVA',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_impuesto_id) REFERENCES tipos_impuesto(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    INDEX idx_empresa_periodo (empresa_id, periodo_liquidacion),
    INDEX idx_agente_cuit (agente_cuit),
    INDEX idx_fecha (fecha_percepcion)
);

-- Histórico de retenciones
CREATE TABLE retenciones_historico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    retencion_id INT NOT NULL,
    accion ENUM('CREADA', 'MODIFICADA', 'ANULADA') NOT NULL,
    datos_anteriores JSON,
    datos_nuevos JSON,
    usuario_id INT NOT NULL,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (retencion_id) REFERENCES retenciones(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_retencion_fecha (retencion_id, fecha_accion)
);
