-- =====================================================
-- SISTEMA CONTABLE ARGENTINO - ESTRUCTURA COMPLETA
-- Base de datos normalizada con históricos
-- =====================================================

-- Configuración inicial
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS contable_argentino;
CREATE DATABASE contable_argentino CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE contable_argentino;

-- =====================================================
-- MÓDULO DE SEGURIDAD Y USUARIOS
-- =====================================================

-- Tabla de roles del sistema
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSON,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    ultimo_login TIMESTAMP NULL,
    intentos_fallidos INT DEFAULT 0,
    bloqueado_hasta TIMESTAMP NULL,
    debe_cambiar_password BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Relación usuarios-roles (muchos a muchos)
CREATE TABLE usuario_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    rol_id INT NOT NULL,
    asignado_por INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (asignado_por) REFERENCES usuarios(id),
    UNIQUE KEY unique_usuario_rol (usuario_id, rol_id)
);

-- Sesiones activas
CREATE TABLE sesiones (
    id VARCHAR(255) PRIMARY KEY,
    usuario_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    datos_sesion JSON,
    ultimo_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_en TIMESTAMP NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_activa (usuario_id, activa),
    INDEX idx_expiracion (expira_en)
);

-- =====================================================
-- MÓDULO DE EMPRESAS Y CLIENTES
-- =====================================================

-- Tipos de empresa
CREATE TABLE tipos_empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Categorías fiscales
CREATE TABLE categorias_fiscales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    requiere_cuit BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE
);

-- Jurisdicciones (provincias, municipios)
CREATE TABLE jurisdicciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('NACIONAL', 'PROVINCIAL', 'MUNICIPAL') NOT NULL,
    jurisdiccion_padre_id INT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (jurisdiccion_padre_id) REFERENCES jurisdicciones(id)
);

-- Empresas/clientes
CREATE TABLE empresas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    razon_social VARCHAR(255) NOT NULL,
    nombre_fantasia VARCHAR(255),
    cuit VARCHAR(13) NOT NULL UNIQUE,
    tipo_empresa_id INT NOT NULL,
    categoria_fiscal_id INT NOT NULL,
    fecha_inicio_actividades DATE NOT NULL,
    domicilio_fiscal TEXT NOT NULL,
    codigo_postal VARCHAR(10),
    jurisdiccion_id INT NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    email_secundario VARCHAR(100),
    whatsapp VARCHAR(20),
    contacto_nombre VARCHAR(100),
    contacto_cargo VARCHAR(100),
    observaciones TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_empresa_id) REFERENCES tipos_empresa(id),
    FOREIGN KEY (categoria_fiscal_id) REFERENCES categorias_fiscales(id),
    FOREIGN KEY (jurisdiccion_id) REFERENCES jurisdicciones(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    INDEX idx_cuit (cuit),
    INDEX idx_razon_social (razon_social)
);

-- Histórico de empresas
CREATE TABLE empresas_historico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    campo_modificado VARCHAR(50) NOT NULL,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    usuario_id INT NOT NULL,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_empresa_fecha (empresa_id, fecha_modificacion)
);

-- Permisos de usuarios sobre empresas
CREATE TABLE usuario_empresas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    empresa_id INT NOT NULL,
    permisos JSON NOT NULL,
    asignado_por INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (asignado_por) REFERENCES usuarios(id),
    UNIQUE KEY unique_usuario_empresa (usuario_id, empresa_id)
);

-- =====================================================
-- MÓDULO CONTABLE - PLAN DE CUENTAS
-- =====================================================

-- Tipos de cuenta
CREATE TABLE tipos_cuenta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    naturaleza ENUM('DEUDORA', 'ACREEDORA') NOT NULL,
    categoria ENUM('ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'EGRESO') NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Plan de cuentas
CREATE TABLE plan_cuentas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    tipo_cuenta_id INT NOT NULL,
    cuenta_padre_id INT NULL,
    nivel INT NOT NULL DEFAULT 1,
    imputable BOOLEAN DEFAULT TRUE,
    ajustable_inflacion BOOLEAN DEFAULT FALSE,
    centro_costo_obligatorio BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_cuenta_id) REFERENCES tipos_cuenta(id),
    FOREIGN KEY (cuenta_padre_id) REFERENCES plan_cuentas(id),
    UNIQUE KEY unique_empresa_codigo (empresa_id, codigo),
    INDEX idx_empresa_nivel (empresa_id, nivel),
    INDEX idx_codigo (codigo)
);

-- Histórico del plan de cuentas
CREATE TABLE plan_cuentas_historico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cuenta_id INT NOT NULL,
    campo_modificado VARCHAR(50) NOT NULL,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    usuario_id INT NOT NULL,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cuenta_id) REFERENCES plan_cuentas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_cuenta_fecha (cuenta_id, fecha_modificacion)
);

-- =====================================================
-- MÓDULO CONTABLE - ASIENTOS Y MOVIMIENTOS
-- =====================================================

-- Tipos de comprobante
CREATE TABLE tipos_comprobante (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    prefijo VARCHAR(5),
    numeracion_automatica BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE
);

-- Centros de costo
CREATE TABLE centros_costo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_empresa_codigo (empresa_id, codigo)
);

-- Asientos contables
CREATE TABLE asientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    numero INT NOT NULL,
    fecha DATE NOT NULL,
    tipo_comprobante_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    referencia VARCHAR(100),
    total_debe DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_haber DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    estado ENUM('BORRADOR', 'CONFIRMADO', 'ANULADO') DEFAULT 'BORRADOR',
    fecha_confirmacion TIMESTAMP NULL,
    confirmado_por INT NULL,
    fecha_anulacion TIMESTAMP NULL,
    anulado_por INT NULL,
    motivo_anulacion TEXT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_comprobante_id) REFERENCES tipos_comprobante(id),
    FOREIGN KEY (confirmado_por) REFERENCES usuarios(id),
    FOREIGN KEY (anulado_por) REFERENCES usuarios(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    UNIQUE KEY unique_empresa_numero (empresa_id, numero),
    INDEX idx_empresa_fecha (empresa_id, fecha),
    INDEX idx_estado (estado)
);

-- Movimientos de asientos
CREATE TABLE movimientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asiento_id INT NOT NULL,
    cuenta_id INT NOT NULL,
    centro_costo_id INT NULL,
    descripcion TEXT,
    debe DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    haber DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    orden INT NOT NULL DEFAULT 1,
    FOREIGN KEY (asiento_id) REFERENCES asientos(id) ON DELETE CASCADE,
    FOREIGN KEY (cuenta_id) REFERENCES plan_cuentas(id),
    FOREIGN KEY (centro_costo_id) REFERENCES centros_costo(id),
    INDEX idx_asiento (asiento_id),
    INDEX idx_cuenta (cuenta_id),
    INDEX idx_fecha_cuenta (asiento_id, cuenta_id)
);

-- Histórico de asientos
CREATE TABLE asientos_historico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asiento_id INT NOT NULL,
    accion ENUM('CREADO', 'MODIFICADO', 'CONFIRMADO', 'ANULADO') NOT NULL,
    datos_anteriores JSON,
    datos_nuevos JSON,
    usuario_id INT NOT NULL,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (asiento_id) REFERENCES asientos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_asiento_fecha (asiento_id, fecha_accion)
);
