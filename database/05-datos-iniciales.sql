-- =====================================================
-- DATOS INICIALES DEL SISTEMA
-- =====================================================

-- Insertar roles del sistema
INSERT INTO roles (nombre, descripcion, permisos) VALUES
('SUPER_ADMIN', 'Administrador del sistema con acceso total', '{"all": true}'),
('ADMIN', 'Administrador de empresa', '{"empresa": ["read", "write"], "usuarios": ["read", "write"], "contabilidad": ["read", "write"]}'),
('CONTADOR', 'Contador público', '{"empresa": ["read"], "contabilidad": ["read", "write"], "reportes": ["read"]}'),
('ASISTENTE', 'Asistente contable', '{"contabilidad": ["read", "write"], "reportes": ["read"]}'),
('CONSULTA', 'Solo consulta', '{"contabilidad": ["read"], "reportes": ["read"]}');

-- Insertar tipos de empresa
INSERT INTO tipos_empresa (codigo, descripcion) VALUES
('SA', 'Sociedad Anónima'),
('SRL', 'Sociedad de Responsabilidad Limitada'),
('SAS', 'Sociedad por Acciones Simplificada'),
('MONO', 'Monotributista'),
('RI', 'Responsable Inscripto'),
('EX', 'Exento'),
('CF', 'Consumidor Final');

-- Insertar categorías fiscales
INSERT INTO categorias_fiscales (codigo, descripcion, requiere_cuit) VALUES
('RI', 'Responsable Inscripto', TRUE),
('MONO', 'Monotributista', TRUE),
('EX', 'Exento', TRUE),
('NI', 'No Inscripto', FALSE),
('CF', 'Consumidor Final', FALSE);

-- Insertar jurisdicciones
INSERT INTO jurisdicciones (codigo, nombre, tipo) VALUES
('NAC', 'Nacional', 'NACIONAL'),
('CABA', 'Ciudad Autónoma de Buenos Aires', 'PROVINCIAL'),
('BA', 'Buenos Aires', 'PROVINCIAL'),
('CAT', 'Catamarca', 'PROVINCIAL'),
('CHA', 'Chaco', 'PROVINCIAL'),
('CHU', 'Chubut', 'PROVINCIAL'),
('COR', 'Córdoba', 'PROVINCIAL'),
('COR_CAP', 'Córdoba Capital', 'MUNICIPAL'),
('ROS', 'Rosario', 'MUNICIPAL');

-- Insertar tipos de cuenta
INSERT INTO tipos_cuenta (codigo, descripcion, naturaleza, categoria) VALUES
('ACT_COR', 'Activo Corriente', 'DEUDORA', 'ACTIVO'),
('ACT_NCO', 'Activo No Corriente', 'DEUDORA', 'ACTIVO'),
('PAS_COR', 'Pasivo Corriente', 'ACREEDORA', 'PASIVO'),
('PAS_NCO', 'Pasivo No Corriente', 'ACREEDORA', 'PASIVO'),
('PAT_NET', 'Patrimonio Neto', 'ACREEDORA', 'PATRIMONIO'),
('ING_ORD', 'Ingresos Ordinarios', 'ACREEDORA', 'INGRESO'),
('ING_EXT', 'Ingresos Extraordinarios', 'ACREEDORA', 'INGRESO'),
('EGR_ORD', 'Egresos Ordinarios', 'DEUDORA', 'EGRESO'),
('EGR_EXT', 'Egresos Extraordinarios', 'DEUDORA', 'EGRESO');

-- Insertar tipos de comprobante
INSERT INTO tipos_comprobante (codigo, descripcion, prefijo, numeracion_automatica) VALUES
('ASI', 'Asiento Manual', 'ASI', TRUE),
('FAC', 'Factura', 'FAC', TRUE),
('REC', 'Recibo', 'REC', TRUE),
('ORD', 'Orden de Pago', 'ORD', TRUE),
('AJU', 'Ajuste', 'AJU', TRUE),
('CIE', 'Cierre', 'CIE', TRUE);

-- Insertar tipos de impuesto
INSERT INTO tipos_impuesto (codigo, descripcion, jurisdiccion_id) VALUES
('IVA', 'Impuesto al Valor Agregado', 1),
('IIBB_CABA', 'Ingresos Brutos CABA', 2),
('IIBB_BA', 'Ingresos Brutos Buenos Aires', 3),
('GAN', 'Impuesto a las Ganancias', 1),
('BIE_PER', 'Bienes Personales', 1),
('SEL', 'Impuesto a los Sellos', 2);

-- Insertar alícuotas de IVA
INSERT INTO alicuotas_impuesto (tipo_impuesto_id, codigo, descripcion, porcentaje, fecha_desde) VALUES
(1, 'IVA_21', 'IVA 21%', 21.00, '2000-01-01'),
(1, 'IVA_105', 'IVA 10.5%', 10.50, '2000-01-01'),
(1, 'IVA_27', 'IVA 27%', 27.00, '2000-01-01'),
(1, 'IVA_0', 'IVA 0%', 0.00, '2000-01-01'),
(1, 'IVA_EX', 'IVA Exento', 0.00, '2000-01-01');

-- Insertar categorías de bienes de uso
INSERT INTO categorias_bienes (codigo, descripcion, vida_util_años, porcentaje_amortizacion) VALUES
('EDIF', 'Edificios', 50, 2.00),
('INST', 'Instalaciones', 10, 10.00),
('MAQ', 'Maquinarias', 10, 10.00),
('MOB', 'Muebles y Útiles', 10, 10.00),
('ROD', 'Rodados', 5, 20.00),
('EQU_COMP', 'Equipos de Computación', 3, 33.33),
('HER', 'Herramientas', 5, 20.00);

-- Insertar métodos de amortización
INSERT INTO metodos_amortizacion (codigo, descripcion, formula) VALUES
('LINEAL', 'Línea Recta', 'valor_origen * porcentaje / 100'),
('ACELERADA', 'Acelerada', 'valor_origen * porcentaje * 1.5 / 100'),
('DECRECIENTE', 'Decreciente', 'valor_neto * porcentaje / 100');

-- Insertar regímenes de retención
INSERT INTO regimenes_retencion (codigo, descripcion, tipo_impuesto_id, porcentaje_retencion, minimo_no_imponible, fecha_desde) VALUES
('RET_IVA_6', 'Retención IVA 6%', 1, 6.00, 1000.00, '2023-01-01'),
('RET_GAN_6', 'Retención Ganancias 6%', 4, 6.00, 1200.00, '2023-01-01'),
('RET_IIBB_3', 'Retención IIBB 3%', 2, 3.00, 800.00, '2023-01-01');

-- Insertar tipos de notificación
INSERT INTO tipos_notificacion (codigo, descripcion, template_email, template_whatsapp) VALUES
('VENC_IVA', 'Vencimiento IVA', 'Recordatorio: Vencimiento IVA el {fecha}', 'Vence IVA: {fecha}'),
('VENC_IIBB', 'Vencimiento IIBB', 'Recordatorio: Vencimiento IIBB el {fecha}', 'Vence IIBB: {fecha}'),
('VENC_GAN', 'Vencimiento Ganancias', 'Recordatorio: Vencimiento Ganancias el {fecha}', 'Vence Ganancias: {fecha}'),
('BACKUP', 'Backup Completado', 'Backup completado exitosamente', 'Backup OK'),
('ERROR', 'Error del Sistema', 'Error detectado: {mensaje}', 'Error: {mensaje}');

-- Insertar configuración del sistema
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo, categoria) VALUES
('EMPRESA_NOMBRE', 'Sistema Contable Argentino', 'Nombre del sistema', 'STRING', 'GENERAL'),
('EMPRESA_VERSION', '1.0.0', 'Versión del sistema', 'STRING', 'GENERAL'),
('BACKUP_AUTOMATICO', 'true', 'Realizar backup automático', 'BOOLEAN', 'BACKUP'),
('BACKUP_HORA', '02:00', 'Hora del backup automático', 'STRING', 'BACKUP'),
('BACKUP_DIAS_RETENCION', '30', 'Días de retención de backups', 'INTEGER', 'BACKUP'),
('EMAIL_SMTP_HOST', 'smtp.gmail.com', 'Servidor SMTP', 'STRING', 'EMAIL'),
('EMAIL_SMTP_PORT', '587', 'Puerto SMTP', 'INTEGER', 'EMAIL'),
('EMAIL_SMTP_TLS', 'true', 'Usar TLS', 'BOOLEAN', 'EMAIL'),
('WHATSAPP_API_URL', '', 'URL API WhatsApp', 'STRING', 'WHATSAPP'),
('AFIP_AMBIENTE', 'TESTING', 'Ambiente AFIP (TESTING/PRODUCTION)', 'STRING', 'AFIP'),
('MONEDA_BASE', 'ARS', 'Moneda base del sistema', 'STRING', 'CONTABLE'),
('EJERCICIO_FISCAL_INICIO', '01-01', 'Inicio ejercicio fiscal (MM-DD)', 'STRING', 'CONTABLE');

-- Insertar algunos índices de inflación (datos de ejemplo)
INSERT INTO indices_inflacion (fecha, indice_valor, variacion_mensual, variacion_anual, fuente) VALUES
('2023-01-01', 100.0000, 0.00, 0.00, 'INDEC'),
('2023-02-01', 106.2000, 6.20, 6.20, 'INDEC'),
('2023-03-01', 113.4400, 6.80, 13.44, 'INDEC'),
('2023-04-01', 121.0000, 6.70, 21.00, 'INDEC'),
('2023-05-01', 129.2000, 6.80, 29.20, 'INDEC'),
('2023-06-01', 138.0000, 6.80, 38.00, 'INDEC'),
('2023-07-01', 147.5000, 6.90, 47.50, 'INDEC'),
('2023-08-01', 158.0000, 7.10, 58.00, 'INDEC'),
('2023-09-01', 169.8000, 7.50, 69.80, 'INDEC'),
('2023-10-01', 182.5000, 7.50, 82.50, 'INDEC'),
('2023-11-01', 196.0000, 7.40, 96.00, 'INDEC'),
('2023-12-01', 211.4000, 7.90, 111.40, 'INDEC');

-- Crear usuario administrador por defecto
INSERT INTO usuarios (username, email, password_hash, nombre, apellido, activo) VALUES
('admin', 'admin@sistema.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye7VFnjZcHzP3.K9n/qeGTa2xpg8kRO6.', 'Administrador', 'Sistema', TRUE);

-- Asignar rol de super admin al usuario administrador
INSERT INTO usuario_roles (usuario_id, rol_id, asignado_por) VALUES
(1, 1, 1);

-- Crear empresa de ejemplo
INSERT INTO empresas (razon_social, nombre_fantasia, cuit, tipo_empresa_id, categoria_fiscal_id, fecha_inicio_actividades, domicilio_fiscal, codigo_postal, jurisdiccion_id, telefono, email, created_by) VALUES
('EMPRESA DEMO S.A.', 'Demo', '30-12345678-9', 1, 1, '2023-01-01', 'Av. Corrientes 1234, CABA', '1043', 2, '011-4444-5555', 'demo@empresa.com', 1);

-- Asignar permisos al admin sobre la empresa demo
INSERT INTO usuario_empresas (usuario_id, empresa_id, permisos, asignado_por) VALUES
(1, 1, '{"all": true}', 1);
