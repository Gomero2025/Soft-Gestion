-- =====================================================
-- MÓDULO DE NOTIFICACIONES Y VENCIMIENTOS
-- =====================================================

-- Tipos de notificación
CREATE TABLE tipos_notificacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    template_email TEXT,
    template_whatsapp TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- Configuración de notificaciones por empresa
CREATE TABLE configuracion_notificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    tipo_notificacion_id INT NOT NULL,
    email_habilitado BOOLEAN DEFAULT TRUE,
    whatsapp_habilitado BOOLEAN DEFAULT FALSE,
    dias_anticipacion INT DEFAULT 5,
    horario_envio TIME DEFAULT '09:00:00',
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_notificacion_id) REFERENCES tipos_notificacion(id),
    UNIQUE KEY unique_empresa_tipo (empresa_id, tipo_notificacion_id)
);

-- Vencimientos programados
CREATE TABLE vencimientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    tipo_impuesto_id INT NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    monto_estimado DECIMAL(15,2),
    estado ENUM('PENDIENTE', 'NOTIFICADO', 'CUMPLIDO', 'VENCIDO') DEFAULT 'PENDIENTE',
    liquidacion_id INT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_impuesto_id) REFERENCES tipos_impuesto(id),
    FOREIGN KEY (liquidacion_id) REFERENCES liquidaciones(id),
    INDEX idx_empresa_fecha (empresa_id, fecha_vencimiento),
    INDEX idx_estado (estado)
);

-- Notificaciones enviadas
CREATE TABLE notificaciones_enviadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    vencimiento_id INT NULL,
    tipo_notificacion_id INT NOT NULL,
    destinatario_email VARCHAR(100),
    destinatario_whatsapp VARCHAR(20),
    asunto VARCHAR(255),
    mensaje TEXT NOT NULL,
    canal ENUM('EMAIL', 'WHATSAPP', 'SISTEMA') NOT NULL,
    estado ENUM('PENDIENTE', 'ENVIADO', 'ENTREGADO', 'ERROR') DEFAULT 'PENDIENTE',
    fecha_programada TIMESTAMP NOT NULL,
    fecha_enviado TIMESTAMP NULL,
    fecha_entregado TIMESTAMP NULL,
    error_mensaje TEXT NULL,
    intentos INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (vencimiento_id) REFERENCES vencimientos(id),
    FOREIGN KEY (tipo_notificacion_id) REFERENCES tipos_notificacion(id),
    INDEX idx_empresa_fecha (empresa_id, fecha_programada),
    INDEX idx_estado (estado),
    INDEX idx_canal (canal)
);

-- =====================================================
-- MÓDULO DE IMPORTACIÓN Y EXPORTACIÓN
-- =====================================================

-- Configuraciones de importación
CREATE TABLE configuraciones_importacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo_archivo ENUM('EXCEL', 'CSV', 'TXT', 'XML') NOT NULL,
    tipo_datos ENUM('IVA_VENTAS', 'IVA_COMPRAS', 'IIBB', 'GANANCIAS', 'BANCO', 'ASIENTOS') NOT NULL,
    configuracion_mapeo JSON NOT NULL,
    delimitador VARCHAR(5) DEFAULT ',',
    encoding VARCHAR(20) DEFAULT 'UTF-8',
    tiene_encabezado BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    INDEX idx_empresa_tipo (empresa_id, tipo_datos)
);

-- Histórico de importaciones
CREATE TABLE importaciones_historico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    configuracion_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    tamaño_archivo BIGINT NOT NULL,
    registros_procesados INT NOT NULL DEFAULT 0,
    registros_exitosos INT NOT NULL DEFAULT 0,
    registros_errores INT NOT NULL DEFAULT 0,
    estado ENUM('PROCESANDO', 'COMPLETADO', 'ERROR') DEFAULT 'PROCESANDO',
    errores_detalle JSON,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    procesado_por INT NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (configuracion_id) REFERENCES configuraciones_importacion(id),
    FOREIGN KEY (procesado_por) REFERENCES usuarios(id),
    INDEX idx_empresa_fecha (empresa_id, fecha_inicio),
    INDEX idx_estado (estado)
);

-- Configuraciones de exportación
CREATE TABLE configuraciones_exportacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo_reporte ENUM('LIBRO_DIARIO', 'LIBRO_MAYOR', 'BALANCE', 'ESTADO_RESULTADOS', 'LIBRO_IVA', 'SICORE') NOT NULL,
    formato ENUM('PDF', 'EXCEL', 'CSV', 'XML', 'TXT') NOT NULL,
    configuracion_formato JSON,
    activo BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES usuarios(id)
);

-- =====================================================
-- MÓDULO DE AUDITORÍA GENERAL
-- =====================================================

-- Log general de auditoría
CREATE TABLE auditoria (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    empresa_id INT NULL,
    tabla_afectada VARCHAR(50) NOT NULL,
    registro_id INT NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE', 'SELECT') NOT NULL,
    datos_anteriores JSON,
    datos_nuevos JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    INDEX idx_usuario_fecha (usuario_id, fecha_accion),
    INDEX idx_empresa_fecha (empresa_id, fecha_accion),
    INDEX idx_tabla_registro (tabla_afectada, registro_id),
    INDEX idx_fecha (fecha_accion)
);

-- Configuración del sistema
CREATE TABLE configuracion_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    descripcion TEXT,
    tipo ENUM('STRING', 'INTEGER', 'DECIMAL', 'BOOLEAN', 'JSON') DEFAULT 'STRING',
    categoria VARCHAR(50) DEFAULT 'GENERAL',
    modificable BOOLEAN DEFAULT TRUE,
    updated_by INT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES usuarios(id),
    INDEX idx_categoria (categoria)
);

-- Respaldos automáticos
CREATE TABLE respaldos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_archivo VARCHAR(255) NOT NULL,
    tamaño_archivo BIGINT NOT NULL,
    tipo ENUM('COMPLETO', 'INCREMENTAL', 'DIFERENCIAL') NOT NULL,
    estado ENUM('INICIADO', 'COMPLETADO', 'ERROR') DEFAULT 'INICIADO',
    ruta_archivo VARCHAR(500) NOT NULL,
    checksum VARCHAR(64),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    error_mensaje TEXT NULL,
    INDEX idx_fecha (fecha_inicio),
    INDEX idx_estado (estado)
);

SET FOREIGN_KEY_CHECKS = 1;
