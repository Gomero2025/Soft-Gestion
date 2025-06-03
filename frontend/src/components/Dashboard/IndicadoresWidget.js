"use client"
import { useState } from "react"
import { Card, Row, Col, ProgressBar, Table, Badge } from "react-bootstrap"
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Info } from "lucide-react"

const IndicadoresWidget = ({ indicadores, empresaId }) => {
  const [loading, setLoading] = useState(false)
  const [detalleVisible, setDetalleVisible] = useState(false)

  // Calcular porcentaje de posición IVA
  const calcularPorcentajeIva = () => {
    if (!indicadores?.ivaDebito || indicadores.ivaDebito === 0) return 0
    return Math.abs((indicadores.posicionIva / indicadores.ivaDebito) * 100)
  }

  // Determinar color según el estado
  const getColorByValue = (value) => {
    if (value > 0) return "danger"
    if (value < 0) return "success"
    return "secondary"
  }

  const formatCurrency = (value) => {
    if (!value) return "$0"
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const indicadoresData = [
    {
      titulo: "Posición IVA",
      valor: indicadores?.posicionIva || 0,
      descripcion: indicadores?.posicionIva >= 0 ? "A pagar" : "A favor",
      icono: indicadores?.posicionIva >= 0 ? TrendingUp : TrendingDown,
      color: getColorByValue(indicadores?.posicionIva),
      porcentaje: calcularPorcentajeIva(),
    },
    {
      titulo: "IIBB",
      valor: indicadores?.saldoIIBB || 0,
      descripcion: indicadores?.saldoIIBB >= 0 ? "A pagar" : "A favor",
      icono: DollarSign,
      color: getColorByValue(indicadores?.saldoIIBB),
      porcentaje: 0,
    },
    {
      titulo: "Ganancias",
      valor: indicadores?.saldoGanancias || 0,
      descripcion: indicadores?.saldoGanancias >= 0 ? "A pagar" : "A favor",
      icono: DollarSign,
      color: getColorByValue(indicadores?.saldoGanancias),
      porcentaje: 0,
    },
  ]

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <TrendingUp className="me-2" size={20} />
            Indicadores Fiscales
          </h5>
          <div className="d-flex gap-2">
            <Badge bg="info" className="cursor-pointer" onClick={() => setDetalleVisible(!detalleVisible)}>
              {detalleVisible ? "Ocultar" : "Ver"} Detalle
            </Badge>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {/* Indicadores principales */}
        <Row className="g-3 mb-4">
          {indicadoresData.map((indicador, index) => {
            const IconComponent = indicador.icono
            return (
              <Col md={4} key={index}>
                <div className="border rounded p-3 h-100">
                  <div className="d-flex align-items-center mb-2">
                    <div className={`bg-${indicador.color} bg-opacity-10 rounded-circle p-2 me-3`}>
                      <IconComponent className={`text-${indicador.color}`} size={20} />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0 text-muted">{indicador.titulo}</h6>
                      <small className={`text-${indicador.color}`}>{indicador.descripcion}</small>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h4 className={`mb-1 text-${indicador.color}`}>{formatCurrency(Math.abs(indicador.valor))}</h4>
                    {indicador.porcentaje > 0 && (
                      <ProgressBar
                        variant={indicador.color}
                        now={Math.min(indicador.porcentaje, 100)}
                        className="mb-1"
                        style={{ height: "4px" }}
                      />
                    )}
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>

        {/* Detalle expandible */}
        {detalleVisible && (
          <div className="border-top pt-3">
            <h6 className="mb-3">
              <Info className="me-2" size={16} />
              Detalle IVA Mes Actual
            </h6>

            <Table size="sm" className="mb-0">
              <tbody>
                <tr>
                  <td className="border-0 ps-0">
                    <strong>IVA Débito Fiscal</strong>
                    <br />
                    <small className="text-muted">Ventas gravadas</small>
                  </td>
                  <td className="border-0 text-end">
                    <span className="text-danger fw-bold">{formatCurrency(indicadores?.ivaDebito || 0)}</span>
                  </td>
                </tr>
                <tr>
                  <td className="border-0 ps-0">
                    <strong>IVA Crédito Fiscal</strong>
                    <br />
                    <small className="text-muted">Compras gravadas</small>
                  </td>
                  <td className="border-0 text-end">
                    <span className="text-success fw-bold">{formatCurrency(indicadores?.ivaCredito || 0)}</span>
                  </td>
                </tr>
                <tr className="border-top">
                  <td className="ps-0">
                    <strong>Posición Neta</strong>
                    <br />
                    <small className="text-muted">
                      {indicadores?.posicionIva >= 0 ? "Saldo a ingresar" : "Saldo a favor"}
                    </small>
                  </td>
                  <td className="text-end">
                    <span className={`fw-bold text-${getColorByValue(indicadores?.posicionIva)}`}>
                      {formatCurrency(Math.abs(indicadores?.posicionIva || 0))}
                    </span>
                  </td>
                </tr>
              </tbody>
            </Table>

            {/* Alertas y recomendaciones */}
            {indicadores?.posicionIva > 50000 && (
              <div className="alert alert-warning mt-3 mb-0 d-flex align-items-center">
                <AlertTriangle className="me-2" size={16} />
                <small>
                  <strong>Atención:</strong> Saldo a pagar elevado. Considere revisar retenciones sufridas.
                </small>
              </div>
            )}

            {indicadores?.posicionIva < -20000 && (
              <div className="alert alert-info mt-3 mb-0 d-flex align-items-center">
                <Info className="me-2" size={16} />
                <small>
                  <strong>Información:</strong> Saldo a favor considerable. Puede solicitar devolución o imputar a
                  períodos siguientes.
                </small>
              </div>
            )}
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            Actualizando indicadores...
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default IndicadoresWidget
