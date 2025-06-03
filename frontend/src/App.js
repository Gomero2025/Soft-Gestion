"use client"
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

import LoginForm from "./components/Auth/LoginForm"
import EmpresaSelector from "./components/Auth/EmpresaSelector"
import Layout from "./components/Layout/Layout"
import DashboardMain from "./components/Dashboard/DashboardMain"
import PlanCuentas from "./pages/Contabilidad/PlanCuentas"
import Asientos from "./pages/Contabilidad/Asientos"
import EmptyPage from "./pages/EmptyPage"
import { authService } from "./services/authService"

// Iconos para páginas vacías
import {
  BookOpen,
  Calculator,
  Receipt,
  Building2,
  Upload,
  FileText,
  TrendingUp,
  Settings,
  Users,
  Bell,
  Shield,
  Database,
  Calendar,
  Download,
} from "lucide-react"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser()
        setUser(currentUser)
        setIsAuthenticated(true)

        const empresaStr = localStorage.getItem("empresaSeleccionada")
        if (empresaStr) {
          setEmpresaSeleccionada(JSON.parse(empresaStr))
        }

        await authService.verifyToken()
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error)
      handleLogout()
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleEmpresaSelected = (empresa) => {
    setEmpresaSeleccionada(empresa)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Error en logout:", error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      setEmpresaSeleccionada(null)
    }
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Iniciando sistema...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />
  }

  if (!empresaSeleccionada) {
    return <EmpresaSelector user={user} onEmpresaSelected={handleEmpresaSelected} />
  }

  return (
    <Router>
      <Layout user={user} empresa={empresaSeleccionada} onLogout={handleLogout}>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<DashboardMain empresaId={empresaSeleccionada.id} />} />
          <Route path="/dashboard" element={<DashboardMain empresaId={empresaSeleccionada.id} />} />

          {/* Contabilidad */}
          <Route path="/contabilidad/plan-cuentas" element={<PlanCuentas />} />
          <Route path="/contabilidad/asientos" element={<Asientos />} />
          <Route
            path="/contabilidad/libro-diario"
            element={
              <EmptyPage
                title="Libro Diario"
                description="Visualización cronológica de todos los asientos contables registrados en el sistema."
                icon={BookOpen}
              />
            }
          />
          <Route
            path="/contabilidad/libro-mayor"
            element={
              <EmptyPage
                title="Libro Mayor"
                description="Movimientos agrupados por cuenta contable con saldos acumulados."
                icon={BookOpen}
              />
            }
          />
          <Route
            path="/contabilidad/balance"
            element={
              <EmptyPage
                title="Balance General"
                description="Estado de situación patrimonial con activos, pasivos y patrimonio neto."
                icon={TrendingUp}
              />
            }
          />
          <Route
            path="/contabilidad/estado-resultados"
            element={
              <EmptyPage
                title="Estado de Resultados"
                description="Análisis de ingresos, egresos y resultado del ejercicio."
                icon={TrendingUp}
              />
            }
          />

          {/* Impuestos */}
          <Route
            path="/impuestos/iva"
            element={
              <EmptyPage
                title="Liquidación IVA"
                description="Cálculo y presentación de la liquidación mensual de IVA."
                icon={Calculator}
              />
            }
          />
          <Route
            path="/impuestos/iibb"
            element={
              <EmptyPage
                title="Liquidación IIBB"
                description="Liquidación de Ingresos Brutos según jurisdicción."
                icon={Calculator}
              />
            }
          />
          <Route
            path="/impuestos/ganancias"
            element={
              <EmptyPage
                title="Liquidación Ganancias"
                description="Cálculo del impuesto a las ganancias empresariales."
                icon={Calculator}
              />
            }
          />
          <Route
            path="/impuestos/periodos"
            element={
              <EmptyPage
                title="Períodos Fiscales"
                description="Gestión de períodos contables y fiscales."
                icon={Calendar}
              />
            }
          />
          <Route
            path="/impuestos/vencimientos"
            element={
              <EmptyPage
                title="Vencimientos"
                description="Calendario de vencimientos fiscales y obligaciones."
                icon={Bell}
              />
            }
          />

          {/* Retenciones */}
          <Route
            path="/retenciones/realizadas"
            element={
              <EmptyPage
                title="Retenciones Realizadas"
                description="Registro y gestión de retenciones efectuadas a proveedores."
                icon={Receipt}
              />
            }
          />
          <Route
            path="/retenciones/percepciones"
            element={
              <EmptyPage
                title="Percepciones Sufridas"
                description="Control de percepciones aplicadas por agentes de retención."
                icon={Receipt}
              />
            }
          />
          <Route
            path="/retenciones/certificados"
            element={
              <EmptyPage
                title="Certificados"
                description="Generación e impresión de certificados de retención."
                icon={FileText}
              />
            }
          />
          <Route
            path="/retenciones/sicore"
            element={
              <EmptyPage
                title="Archivo SICORE"
                description="Generación del archivo SICORE para presentación en AFIP."
                icon={Upload}
              />
            }
          />
          <Route
            path="/retenciones/regimenes"
            element={
              <EmptyPage
                title="Regímenes de Retención"
                description="Configuración de regímenes y alícuotas de retención."
                icon={Settings}
              />
            }
          />

          {/* Bienes de Uso */}
          <Route
            path="/bienes-uso/registro"
            element={
              <EmptyPage
                title="Registro de Bienes"
                description="Alta, baja y modificación de bienes de uso."
                icon={Building2}
              />
            }
          />
          <Route
            path="/bienes-uso/amortizaciones"
            element={
              <EmptyPage
                title="Amortizaciones"
                description="Cálculo automático de amortizaciones mensuales y anuales."
                icon={TrendingUp}
              />
            }
          />
          <Route
            path="/bienes-uso/ajuste-inflacion"
            element={
              <EmptyPage
                title="Ajuste por Inflación"
                description="Aplicación de índices de inflación a bienes de uso."
                icon={TrendingUp}
              />
            }
          />
          <Route
            path="/bienes-uso/categorias"
            element={
              <EmptyPage
                title="Categorías de Bienes"
                description="Gestión de categorías y métodos de amortización."
                icon={Settings}
              />
            }
          />

          {/* Importación */}
          <Route
            path="/importacion/excel"
            element={
              <EmptyPage
                title="Importar Excel"
                description="Importación masiva de datos desde planillas Excel."
                icon={Upload}
              />
            }
          />
          <Route
            path="/importacion/bancos"
            element={
              <EmptyPage
                title="Extractos Bancarios"
                description="Importación y conciliación de extractos bancarios."
                icon={Upload}
              />
            }
          />
          <Route
            path="/importacion/configuraciones"
            element={
              <EmptyPage
                title="Configuraciones"
                description="Configuración de mapeos y formatos de importación."
                icon={Settings}
              />
            }
          />
          <Route
            path="/importacion/historial"
            element={
              <EmptyPage
                title="Historial"
                description="Registro de todas las importaciones realizadas."
                icon={Database}
              />
            }
          />

          {/* Reportes */}
          <Route
            path="/reportes/libro-iva"
            element={
              <EmptyPage
                title="Libro IVA Digital"
                description="Generación del Libro IVA Digital según RG 4172."
                icon={FileText}
              />
            }
          />
          <Route
            path="/reportes/rg4130"
            element={
              <EmptyPage title="RG 4130" description="Archivo de información de compras y ventas." icon={FileText} />
            }
          />
          <Route
            path="/reportes/estados-contables"
            element={
              <EmptyPage
                title="Estados Contables"
                description="Generación completa de estados contables."
                icon={FileText}
              />
            }
          />
          <Route
            path="/reportes/comparativos"
            element={
              <EmptyPage
                title="Reportes Comparativos"
                description="Análisis comparativo entre períodos."
                icon={TrendingUp}
              />
            }
          />
          <Route
            path="/reportes/exportaciones"
            element={
              <EmptyPage
                title="Exportaciones"
                description="Exportación de datos en múltiples formatos."
                icon={Download}
              />
            }
          />

          {/* Configuración */}
          <Route
            path="/configuracion/empresa"
            element={
              <EmptyPage
                title="Configuración de Empresa"
                description="Datos fiscales y configuración general de la empresa."
                icon={Building2}
              />
            }
          />
          <Route
            path="/configuracion/usuarios"
            element={
              <EmptyPage
                title="Gestión de Usuarios"
                description="Administración de usuarios y permisos del sistema."
                icon={Users}
              />
            }
          />
          <Route
            path="/configuracion/notificaciones"
            element={
              <EmptyPage
                title="Notificaciones"
                description="Configuración de alertas y notificaciones automáticas."
                icon={Bell}
              />
            }
          />
          <Route
            path="/configuracion/afip"
            element={
              <EmptyPage
                title="Integración AFIP"
                description="Configuración de certificados y conexión con AFIP."
                icon={Shield}
              />
            }
          />
          <Route
            path="/configuracion/backup"
            element={
              <EmptyPage
                title="Backup y Restauración"
                description="Gestión de copias de seguridad automáticas."
                icon={Database}
              />
            }
          />
          <Route
            path="/configuracion/sistema"
            element={
              <EmptyPage
                title="Configuración del Sistema"
                description="Parámetros generales y configuración avanzada."
                icon={Settings}
              />
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
