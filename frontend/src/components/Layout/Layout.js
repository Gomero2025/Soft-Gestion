"use client"
import { useState } from "react"
import { Container } from "react-bootstrap"
import Sidebar from "./Sidebar"
import Header from "./Header"
import "./Layout.css"

const Layout = ({ children, user, empresa, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="layout-container">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} user={user} empresa={empresa} />

      <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Header user={user} empresa={empresa} onLogout={onLogout} onToggleSidebar={toggleSidebar} />

        <main className="content-area">
          <Container fluid className="py-4">
            {children}
          </Container>
        </main>
      </div>
    </div>
  )
}

export default Layout
