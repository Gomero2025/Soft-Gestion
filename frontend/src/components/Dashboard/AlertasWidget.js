"use client"
import { useState, useEffect } from "react"
import { Card, Badge, Button, ListGroup } from "react-bootstrap"
import { AlertTriangle, AlertCircle, Info, CheckCircle, RefreshCw, X } from "lucide-react"

const AlertasWidget = ({ alertas, empresaId }) => {
  const [alertasInternas, setAlertasInternas] = useState([])
  const [loading, setLoading] = useState(false)
  const [alertasOcultas, setAlertasOcultas] = useState(new Set())

  useEffect(() => {
    // Generar alertas automáticas basadas en datos
    generarAlertasAutomaticas()
  }, [alertas, empresaId])

  const generarAlertasAutomaticas = () => {
    const nuevasAlertas = []
    const ahora = new Date()

    // Alertas de ejemplo basadas en lógica de negocio
    const alertasGeneradas = [
      {
        id: "cert_digital",
        tipo: "warning",
        titulo: "Certificado Digital",
        mensaje: "El certificado digital vence en 30 días. Renueve antes del vencimiento.",
        fecha: new Date(),
        accion: "Renovar certificado",
        prioridad: "media",
      },
      {
        id: "backup",
        tipo: "success",
        titulo: "Backup Completado",
        mensaje: "Backup automático realizado exitosamente a las 02:00 AM.",
        fecha: new Date(ahora.getTime() - 6 * 60 * 60 * 1000), // 6 horas atrás
        accion: null,
        prioridad: "baja",
      },
      {
        id: "inconsistencia_iva",
        tipo: "danger",
        titulo: "Inconsistencia IVA",
        mensaje: "Se detectaron ventas sin IVA débito correspondiente en el período actual.",
        fecha: new Date(ahora.getTime() - 2 * 60 * 60 * 1000), // 2 horas atrás
        accion: "Revisar asientos",
        prioridad: "alta",
      },
      {
        id: "retencion_pendiente",
        tipo: "info",
        titulo: "Retenciones Pendientes",
        mensaje: "Hay 3 certificados de retención pendientes de emisión.",
        fecha: new Date(ahora.getTime() - 30 * 60 * 1000), // 30 minutos atrás
        accion: "Generar certificados",
        prioridad: "media",
      },
    ]

    // Filtrar alertas no ocultas
    const alertasFiltradas = alertasGeneradas.filter((alerta) => !alertasOcultas.has(alerta.id))
    setAlertasInternas(alertasFiltradas)
  }

  const ocultarAlerta = (alertaId) => {
    setAlertasOcultas((prev) => new Set([...prev, alertaId]))
  }

  const actualizarAlertas = async () => {
    setLoading(true)
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      generarAlertasAutomaticas()
    } catch (error) {
      console.error("Error al actualizar alertas:", error)
    } finally {
      setLoading(false)
    }
  }

  const getIconByTipo = (tipo) => {
    switch (tipo) {
      case "danger":
        return <AlertTriangle size={16} />
      case "warning":
        return <AlertCircle size={16} />
      case "info":
        return <Info size={16} />
      case "success":
        return <CheckCircle size={16} />
      default:
        return <Info size={16} />
    }
  }

  const getVariantByTipo = (tipo) => {
    switch (tipo) {
      case "danger":
        return "danger"
      case "warning":
        return "warning"
      case "info":
        return "info"
      case "success":
        return "success"
      default:
        return "secondary"
    }
  }

  const getPrioridadBadge = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return (
          <Badge bg="danger" className="ms-2">
            Alta
          </Badge>
        )
      case "media":
        return (
          <Badge bg="warning" className="ms-2">
            Media
          </Badge>
        )
      case "baja":
        return (
          <Badge bg="secondary" className="ms-2">
            Baja
          </Badge>
        )
      default:
        return null
    }
  }

  const formatearFecha = (fecha) => {
    const ahora = new Date()
    const diferencia = ahora.getTime() - fecha.getTime()
    const minutos = Math.floor(diferencia / (1000 * 60))
    const horas = Math.floor(diferencia / (1000 * 60 * 60))

    if (minutos < 60) {
      return `Hace ${minutos} min`
    } else if (horas < 24) {
      return `Hace ${horas}h`
    } else {
      return fecha.toLocaleDateString("es-AR")
    }
  }

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <AlertTriangle className="me-2" size={20} />
            Alertas del Sistema
          </h5>
          <Button variant="outline-primary" size="sm" onClick={actualizarAlertas} disabled={loading}>
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            ) : (
              <RefreshCw size={14} />
            )}
          </Button>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        {alertasInternas.length === 0 ? (
          <div className="text-center py-5">
            <CheckCircle size={48} className="text-success mb-3" />
            <h6 className="text-muted mb-1">Todo en orden</h6>
            <p className="text-muted mb-0 small">No hay alertas pendientes</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {alertasInternas.map((alerta) => (
              <ListGroup.Item key={alerta.id} className="border-0">
                <div className="d-flex align-items-start">
                  <div className={`text-${getVariantByTipo(alerta.tipo)} me-3 mt-1`}>{getIconByTipo(alerta.tipo)}</div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="mb-0 fw-bold">
                        {alerta.titulo}
                        {getPrioridadBadge(alerta.prioridad)}
                      </h6>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-muted"
                        onClick={() => ocultarAlerta(alerta.id)}
                      >
                        <X size={14} />
                      </Button>
                    </div>

                    <p className="mb-2 text-muted small">{alerta.mensaje}</p>

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">{formatearFecha(alerta.fecha)}</small>

                      {alerta.accion && (
                        <Button variant="outline-primary" size="sm">
                          {alerta.accion}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>

      {alertasInternas.length > 0 && (
        <Card.Footer className="bg-light border-top-0">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {alertasInternas.length} alerta{alertasInternas.length !== 1 ? "s" : ""} activa
              {alertasInternas.length !== 1 ? "s" : ""}
            </small>
            <Button variant="link" size="sm" className="p-0">
              Ver todas las alertas
            </Button>
          </div>
        </Card.Footer>
      )}
    </Card>
  )
}

export default AlertasWidget
