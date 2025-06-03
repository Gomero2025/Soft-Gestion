"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Alert } from "react-bootstrap"
import { AlertTriangle, TrendingUp, DollarSign, FileText, Clock } from "lucide-react"
import { dashboardService } from "../../services/dashboardService"
import VencimientosWidget from "./VencimientosWidget"
import IndicadoresWidget from "./IndicadoresWidget"
import AlertasWidget from "./AlertasWidget"

const DashboardMain = ({ empresaId }) => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [empresaId])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await dashboardService.getDashboard(empresaId)
      setDashboardData(data)
    } catch (err) {
      setError("Error al cargar el dashboard")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">
          <AlertTriangle className="me-2" size={20} />
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-1">Dashboard Contable</h2>
          <p className="text-muted mb-0">
            {dashboardData?.empresa} - {new Date().toLocaleDateString("es-AR")}
          </p>
        </Col>
      </Row>

      {/* Indicadores principales */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                    <DollarSign className="text-primary" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Posición IVA</h6>
                  <h4 className="mb-0">${dashboardData?.indicadores?.posicionIva?.toLocaleString("es-AR") || "0"}</h4>
                  <small className={`text-${dashboardData?.indicadores?.posicionIva >= 0 ? "danger" : "success"}`}>
                    {dashboardData?.indicadores?.posicionIva >= 0 ? "A pagar" : "A favor"}
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3">
                    <TrendingUp className="text-success" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">IVA Débito</h6>
                  <h4 className="mb-0">${dashboardData?.indicadores?.ivaDebito?.toLocaleString("es-AR") || "0"}</h4>
                  <small className="text-muted">Mes actual</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3">
                    <FileText className="text-info" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">IVA Crédito</h6>
                  <h4 className="mb-0">${dashboardData?.indicadores?.ivaCredito?.toLocaleString("es-AR") || "0"}</h4>
                  <small className="text-muted">Mes actual</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                    <Clock className="text-warning" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Vencimientos</h6>
                  <h4 className="mb-0">{dashboardData?.vencimientosProximos?.length || 0}</h4>
                  <small className="text-muted">Próximos 15 días</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Widgets principales */}
      <Row>
        <Col lg={8} className="mb-4">
          <VencimientosWidget vencimientos={dashboardData?.vencimientosProximos || []} onRefresh={loadDashboardData} />
        </Col>
        <Col lg={4} className="mb-4">
          <AlertasWidget alertas={dashboardData?.alertasInconsistencias || []} empresaId={empresaId} />
        </Col>
      </Row>

      {/* Indicadores detallados */}
      <Row>
        <Col lg={12}>
          <IndicadoresWidget indicadores={dashboardData?.indicadores} empresaId={empresaId} />
        </Col>
      </Row>
    </Container>
  )
}

export default DashboardMain
