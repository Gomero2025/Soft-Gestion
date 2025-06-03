"use client"
import { Card, Table, Badge, Button } from "react-bootstrap"
import { Calendar, ExternalLink, AlertCircle } from "lucide-react"

const VencimientosWidget = ({ vencimientos, onRefresh }) => {
  const getVariantByDias = (dias) => {
    if (dias < 0) return "danger"
    if (dias <= 3) return "warning"
    if (dias <= 7) return "info"
    return "secondary"
  }

  const getIconByDias = (dias) => {
    if (dias < 0) return <AlertCircle size={16} className="text-danger" />
    return <Calendar size={16} />
  }

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <Calendar className="me-2" size={20} />
            Próximos Vencimientos
          </h5>
          <Button variant="outline-primary" size="sm" onClick={onRefresh}>
            Actualizar
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {vencimientos.length === 0 ? (
          <div className="text-center py-5">
            <Calendar size={48} className="text-muted mb-3" />
            <p className="text-muted mb-0">No hay vencimientos próximos</p>
          </div>
        ) : (
          <Table responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Impuesto</th>
                <th>Fecha</th>
                <th>Monto Est.</th>
                <th>Estado</th>
                <th>Días</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vencimientos.map((vencimiento) => (
                <tr key={vencimiento.id}>
                  <td>
                    <div>
                      <strong>{vencimiento.tipoImpuesto}</strong>
                      <br />
                      <small className="text-muted">{vencimiento.descripcion}</small>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      {getIconByDias(vencimiento.diasRestantes)}
                      <span className="ms-2">{new Date(vencimiento.fechaVencimiento).toLocaleDateString("es-AR")}</span>
                    </div>
                  </td>
                  <td>
                    {vencimiento.montoEstimado ? (
                      <span className="fw-bold">${vencimiento.montoEstimado.toLocaleString("es-AR")}</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <Badge bg={vencimiento.estado === "PENDIENTE" ? "warning" : "success"}>{vencimiento.estado}</Badge>
                  </td>
                  <td>
                    <Badge bg={getVariantByDias(vencimiento.diasRestantes)}>
                      {vencimiento.diasRestantes < 0
                        ? `${Math.abs(vencimiento.diasRestantes)} días vencido`
                        : `${vencimiento.diasRestantes} días`}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      href={`https://auth.afip.gob.ar/contribuyente_/login.xhtml`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}

export default VencimientosWidget
