"use client"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

import { Nav, Collapse } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  BookOpen,
  Calculator,
  Receipt,
  Building2,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Upload,
  Download,
  TrendingUp,
  Shield,
  Bell,
  Users,
  Database,
} from "lucide-react"

const Sidebar = ({ collapsed, user, empresa }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }))
  }

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      key: "contabilidad",
      label: "Contabilidad",
      icon: BookOpen,
      submenu: [
        { label: "Plan de Cuentas", path: "/contabilidad/plan-cuentas", icon: BookOpen },
        { label: "Asientos", path: "/contabilidad/asientos", icon: FileText },
        { label: "Libro Diario", path: "/contabilidad/libro-diario", icon: BookOpen },
        { label: "Libro Mayor", path: "/contabilidad/libro-mayor", icon: BookOpen },
        { label: "Balance General", path: "/contabilidad/balance", icon: TrendingUp },
        { label: "Estado de Resultados", path: "/contabilidad/estado-resultados", icon: TrendingUp },
      ],
    },
    {
      key: "impuestos",
      label: "Impuestos",
      icon: Calculator,
      submenu: [
        { label: "Liquidación IVA", path: "/impuestos/iva", icon: Calculator },
        { label: "Liquidación IIBB", path: "/impuestos/iibb", icon: Calculator },
        { label: "Liquidación Ganancias", path: "/impuestos/ganancias", icon: Calculator },
        { label: "Períodos Fiscales", path: "/impuestos/periodos", icon: Calendar },
        { label: "Vencimientos", path: "/impuestos/vencimientos", icon: Bell },
      ],
    },
    {
      key: "retenciones",
      label: "Retenciones",
      icon: Receipt,
      submenu: [
        { label: "Retenciones Realizadas", path: "/retenciones/realizadas", icon: Receipt },
        { label: "Percepciones Sufridas", path: "/retenciones/percepciones", icon: Receipt },
        { label: "Certificados", path: "/retenciones/certificados", icon: FileText },
        { label: "Archivo SICORE", path: "/retenciones/sicore", icon: Upload },
        { label: "Regímenes", path: "/retenciones/regimenes", icon: Settings },
      ],
    },
    {
      key: "bienes-uso",
      label: "Bienes de Uso",
      icon: Building2,
      submenu: [
        { label: "Registro de Bienes", path: "/bienes-uso/registro", icon: Building2 },
        { label: "Amortizaciones", path: "/bienes-uso/amortizaciones", icon: TrendingUp },
        { label: "Ajuste por Inflación", path: "/bienes-uso/ajuste-inflacion", icon: TrendingUp },
        { label: "Categorías", path: "/bienes-uso/categorias", icon: Settings },
      ],
    },
    {
      key: "importacion",
      label: "Importación",
      icon: Upload,
      submenu: [
        { label: "Importar Excel", path: "/importacion/excel", icon: Upload },
        { label: "Extractos Bancarios", path: "/importacion/bancos", icon: Upload },
        { label: "Configuraciones", path: "/importacion/configuraciones", icon: Settings },
        { label: "Historial", path: "/importacion/historial", icon: Database },
      ],
    },
    {
      key: "reportes",
      label: "Reportes",
      icon: FileText,
      submenu: [
        { label: "Libro IVA Digital", path: "/reportes/libro-iva", icon: FileText },
        { label: "RG 4130", path: "/reportes/rg4130", icon: FileText },
        { label: "Estados Contables", path: "/reportes/estados-contables", icon: FileText },
        { label: "Comparativos", path: "/reportes/comparativos", icon: TrendingUp },
        { label: "Exportaciones", path: "/reportes/exportaciones", icon: Download },
      ],
    },
    {
      key: "configuracion",
      label: "Configuración",
      icon: Settings,
      submenu: [
        { label: "Empresa", path: "/configuracion/empresa", icon: Building2 },
        { label: "Usuarios", path: "/configuracion/usuarios", icon: Users },
        { label: "Notificaciones", path: "/configuracion/notificaciones", icon: Bell },
        { label: "Integración AFIP", path: "/configuracion/afip", icon: Shield },
        { label: "Backup", path: "/configuracion/backup", icon: Database },
        { label: "Sistema", path: "/configuracion/sistema", icon: Settings },
      ],
    },
  ]

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  const isMenuActive = (submenu) => {
    return submenu?.some((item) => isActive(item.path))
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo y empresa */}
      <div className="sidebar-header">
        {!collapsed && (
          <>
            <div className="logo">
              <Shield className="text-primary" size={32} />
              <span className="logo-text">Contable AR</span>
            </div>
            <div className="empresa-info">
              <div className="empresa-nombre">{empresa?.displayName}</div>
              <div className="empresa-cuit">CUIT: {empresa?.cuit}</div>
            </div>
          </>
        )}
        {collapsed && (
          <div className="logo-collapsed">
            <Shield className="text-primary" size={24} />
          </div>
        )}
      </div>

      {/* Navegación */}
      <Nav className="sidebar-nav flex-column">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          const hasSubmenu = item.submenu && item.submenu.length > 0
          const isExpanded = expandedMenus[item.key]
          const isItemActive = hasSubmenu ? isMenuActive(item.submenu) : isActive(item.path)

          return (
            <div key={item.key} className="nav-item-container">
              <Nav.Link
                className={`nav-item ${isItemActive ? "active" : ""} ${hasSubmenu ? "has-submenu" : ""}`}
                onClick={() => {
                  if (hasSubmenu) {
                    toggleMenu(item.key)
                  } else {
                    handleNavigation(item.path)
                  }
                }}
              >
                <div className="nav-item-content">
                  <IconComponent size={20} className="nav-icon" />
                  {!collapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {hasSubmenu && (
                        <span className="nav-arrow">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </Nav.Link>

              {/* Submenú */}
              {hasSubmenu && !collapsed && (
                <Collapse in={isExpanded}>
                  <div className="submenu">
                    {item.submenu.map((subItem) => {
                      const SubIconComponent = subItem.icon
                      return (
                        <Nav.Link
                          key={subItem.path}
                          className={`submenu-item ${isActive(subItem.path) ? "active" : ""}`}
                          onClick={() => handleNavigation(subItem.path)}
                        >
                          <SubIconComponent size={16} className="submenu-icon" />
                          <span className="submenu-label">{subItem.label}</span>
                        </Nav.Link>
                      )
                    })}
                  </div>
                </Collapse>
              )}
            </div>
          )
        })}
      </Nav>

      {/* Usuario info */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <Users size={20} />
            </div>
            <div className="user-details">
              <div className="user-name">{user?.nombreCompleto}</div>
              <div className="user-role">Contador</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
