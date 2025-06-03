"use client"
import { Navbar, Nav, Dropdown, Badge, Button } from "react-bootstrap"
import { Menu, Bell, User, LogOut, Settings, Building2, RefreshCw } from "lucide-react"

const Header = ({ user, empresa, onLogout, onToggleSidebar }) => {
  const handleLogout = () => {
    if (window.confirm("¿Está seguro que desea cerrar sesión?")) {
      onLogout()
    }
  }

  const cambiarEmpresa = () => {
    localStorage.removeItem("empresaSeleccionada")
    window.location.reload()
  }

  return (
    <Navbar bg="white" className="header-navbar border-bottom px-3">
      <div className="d-flex align-items-center">
        <Button variant="outline-secondary" size="sm" onClick={onToggleSidebar} className="me-3">
          <Menu size={16} />
        </Button>

        <div className="header-breadcrumb">
          <span className="text-muted">ContaTips Sistema Contable</span>
        </div>
      </div>

      <Nav className="ms-auto d-flex align-items-center">
        {/* Empresa actual */}
        <Dropdown className="me-3">
          <Dropdown.Toggle variant="outline-primary" size="sm">
            <Building2 size={16} className="me-2" />
            {empresa?.displayName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>Empresa Actual</Dropdown.Header>
            <Dropdown.Item disabled>
              <div>
                <strong>{empresa?.razonSocial}</strong>
                <br />
                <small className="text-muted">CUIT: {empresa?.cuit}</small>
              </div>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={cambiarEmpresa}>
              <RefreshCw size={16} className="me-2" />
              Cambiar Empresa
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Notificaciones */}
        <Dropdown className="me-3">
          <Dropdown.Toggle variant="outline-secondary" size="sm" className="position-relative">
            <Bell size={16} />
            <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle badge-sm">
              3
            </Badge>
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" style={{ width: "300px" }}>
            <Dropdown.Header>Notificaciones</Dropdown.Header>
            <Dropdown.Item>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <strong>Vencimiento IVA</strong>
                  <br />
                  <small className="text-muted">Vence en 3 días</small>
                </div>
                <Badge bg="warning">Urgente</Badge>
              </div>
            </Dropdown.Item>
            <Dropdown.Item>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <strong>Backup Completado</strong>
                  <br />
                  <small className="text-muted">Hace 2 horas</small>
                </div>
                <Badge bg="success">Info</Badge>
              </div>
            </Dropdown.Item>
            <Dropdown.Item>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <strong>Inconsistencia detectada</strong>
                  <br />
                  <small className="text-muted">Revisar asientos</small>
                </div>
                <Badge bg="danger">Error</Badge>
              </div>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-center">Ver todas las notificaciones</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Usuario */}
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" size="sm">
            <User size={16} className="me-2" />
            {user?.nombre}
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Header>
              {user?.nombreCompleto}
              <br />
              <small className="text-muted">{user?.email}</small>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item>
              <User size={16} className="me-2" />
              Mi Perfil
            </Dropdown.Item>
            <Dropdown.Item>
              <Settings size={16} className="me-2" />
              Configuración
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="text-danger">
              <LogOut size={16} className="me-2" />
              Cerrar Sesión
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  )
}

export default Header
