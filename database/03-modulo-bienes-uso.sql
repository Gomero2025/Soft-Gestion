-- =====================================================
-- MÓDULO DE BIENES DE USO Y AMORTIZACIONES
-- =====================================================

-- Categorías de bienes de uso
CREATE TABLE categorias_bienes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NOT NULL,
    vida_util_años INT NOT NULL,
    porcentaje_amortizacion DECIMAL(5,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Métodos de amortización
CREATE TABLE metodos_amortizacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    formula TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Bienes de uso
CREATE TABLE bienes_uso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    categoria_bien_id INT NOT NULL,
    metodo_amortizacion_id INT NOT NULL,
    fecha_alta DATE NOT NULL,
    fecha_baja DATE NULL,
    valor_origen DECIMAL(15,2) NOT NULL,
    valor_residual DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    vida_util_años INT NOT NULL,
    porcentaje_amortizacion DECIMAL(5,2) NOT NULL,
    amortizacion_acumulada DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    valor_neto DECIMAL(15,2) GENERATED ALWAYS AS (valor_origen - amortizacion_acumulada) STORED,
    ubicacion VARCHAR(255),
    numero_serie VARCHAR(100),
    proveedor VARCHAR(255),
    numero_factura VARCHAR(50),
    estado ENUM('ACTIVO', 'DADO_BAJA', 'VENDIDO') DEFAULT 'ACTIVO',
    motivo_baja TEXT NULL,
    observaciones TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_bien_id) REFERENCES categorias_bienes(id),
    FOREIGN KEY (metodo_amortizacion_id) REFERENCES metodos_amortizacion(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    UNIQUE KEY unique_empresa_codigo (empresa_id, codigo),
    INDEX idx_empresa_estado (empresa_id, estado),
    INDEX idx_fecha_alta (fecha_alta)
);

-- Amortizaciones calculadas
CREATE TABLE amortizaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bien_uso_id INT NOT NULL,
    periodo_fiscal_id INT NOT NULL,
    fecha_calculo DATE NOT NULL,
    valor_origen DECIMAL(15,2) NOT NULL,
    amortizacion_periodo DECIMAL(15,2) NOT NULL,
    amortizacion_acumulada_anterior DECIMAL(15,2) NOT NULL,
    amortizacion_acumulada_nueva DECIMAL(15,2) NOT NULL,
    valor_neto_anterior DECIMAL(15,2) NOT NULL,
    valor_neto_nuevo DECIMAL(15,2) NOT NULL,
    dias_periodo INT NOT NULL,
    porcentaje_aplicado DECIMAL(5,2) NOT NULL,
    asiento_id INT NULL,
    estado ENUM('CALCULADA', 'CONTABILIZADA', 'ANULADA') DEFAULT 'CALCULADA',
    observaciones TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bien_uso_id) REFERENCES bienes_uso(id) ON DELETE CASCADE,
    FOREIGN KEY (periodo_fiscal_id) REFERENCES periodos_fiscales(id),
    FOREIGN KEY (asiento_id) REFERENCES asientos(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    UNIQUE KEY unique_bien_periodo (bien_uso_id, periodo_fiscal_id),
    INDEX idx_fecha_calculo (fecha_calculo),
    INDEX idx_estado (estado)
);

-- Ajustes por inflación de bienes de uso
CREATE TABLE bienes_uso_ajustes_inflacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bien_uso_id INT NOT NULL,
    periodo_fiscal_id INT NOT NULL,
    indice_aplicado DECIMAL(10,6) NOT NULL,
    valor_origen_anterior DECIMAL(15,2) NOT NULL,
    ajuste_valor_origen DECIMAL(15,2) NOT NULL,
    valor_origen_ajustado DECIMAL(15,2) NOT NULL,
    amortizacion_anterior DECIMAL(15,2) NOT NULL,
    ajuste_amortizacion DECIMAL(15,2) NOT NULL,
    amortizacion_ajustada DECIMAL(15,2) NOT NULL,
    asiento_id INT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bien_uso_id) REFERENCES bienes_uso(id) ON DELETE CASCADE,
    FOREIGN KEY (periodo_fiscal_id) REFERENCES periodos_fiscales(id),
    FOREIGN KEY (asiento_id) REFERENCES asientos(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    UNIQUE KEY unique_bien_periodo_ajuste (bien_uso_id, periodo_fiscal_id)
);

-- Histórico de bienes de uso
CREATE TABLE bienes_uso_historico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bien_uso_id INT NOT NULL,
    campo_modificado VARCHAR(50) NOT NULL,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    usuario_id INT NOT NULL,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bien_uso_id) REFERENCES bienes_uso(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_bien_fecha (bien_uso_id, fecha_modificacion)
);

-- =====================================================
-- MÓDULO DE AJUSTE POR INFLACIÓN
-- =====================================================

-- Índices de inflación
CREATE TABLE indices_inflacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL UNIQUE,
    indice_valor DECIMAL(10,6) NOT NULL,
    variacion_mensual DECIMAL(8,4),
    variacion_anual DECIMAL(8,4),
    fuente VARCHAR(100) NOT NULL DEFAULT 'INDEC',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_fecha (fecha)
);

-- Configuración de ajuste por inflación por empresa
CREATE TABLE configuracion_ajuste_inflacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    aplica_ajuste BOOLEAN DEFAULT TRUE,
    fecha_inicio_ajuste DATE NOT NULL,
    metodo_ajuste ENUM('INTEGRAL', 'SIMPLIFICADO') DEFAULT 'INTEGRAL',
    umbral_significatividad DECIMAL(15,2) DEFAULT 1000.00,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_empresa (empresa_id)
);

-- Ajustes por inflación aplicados
CREATE TABLE ajustes_inflacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    periodo_fiscal_id INT NOT NULL,
    cuenta_id INT NOT NULL,
    saldo_inicial DECIMAL(15,2) NOT NULL,
    indice_inicial DECIMAL(10,6) NOT NULL,
    indice_final DECIMAL(10,6) NOT NULL,
    factor_ajuste DECIMAL(10,6) NOT NULL,
    ajuste_calculado DECIMAL(15,2) NOT NULL,
    ajuste_aplicado DECIMAL(15,2) NOT NULL,
    asiento_id INT NULL,
    estado ENUM('CALCULADO', 'APLICADO', 'ANULADO') DEFAULT 'CALCULADO',
    observaciones TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (periodo_fiscal_id) REFERENCES periodos_fiscales(id),
    FOREIGN KEY (cuenta_id) REFERENCES plan_cuentas(id),
    FOREIGN KEY (asiento_id) REFERENCES asientos(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    UNIQUE KEY unique_empresa_periodo_cuenta (empresa_id, periodo_fiscal_id, cuenta_id),
    INDEX idx_estado (estado)
);
