"use client"
import { useState } from "react"
import { Row, Col, Card, Button, Table, Form, InputGroup, Badge, Modal } from "react-bootstrap"
import { Plus, Search, Edit, Trash2, FileText, Calendar, Filter } from "lucide-react"

const Asientos = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedAsiento, setSelectedAsiento] = useState(null)

  // Datos de ejemplo
  const asientos = [
    {
      id: 1,
      numero: 1,
      fecha: "2024-01-15",
      descripcion: "Compra de mercadería",
      debe: 15000,
      haber: 15000,
      estado: "CONFIRMADO",
    },
    {
      id: 2,
      numero: 2,
      fecha: "2024-01-16",
      descripcion: "Venta de productos",
      debe: 12100,
      haber: 12100,
      estado: "CONFIRMADO",
    },
    {
      id: 3,
      numero: 3,
      fecha: "2024-01-17",
      descripcion: "Pago de servicios",
      debe: 5500,
      haber: 5500,
      estado: "BORRADOR",
    },
  ]

  const movimientos = [
    { cuenta: "1.1.01 - Caja", debe: 10000, haber: 0 },
    { cuenta: "4.1.01 - Ventas", debe: 0, haber: 8264 },
    { cuenta: "2.1.05 - IVA Débito Fiscal", debe: 0, haber: 1736 },
  ]

  return (
    <div>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Asientos Contables</h2>
              <p className="text-muted mb-0">Registro y gestión de asientos contables</p>
            </div>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <Plus size={16} className="me-2" />
              Nuevo Asiento
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control placeholder="Buscar asientos..." />
          </InputGroup>
        </Col>
        <Col md={2}>
          <InputGroup>
            <InputGroup.Text>
              <Calendar size={16} />
            </InputGroup.Text>
            <Form.Control type="date" />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Form.Control type="date" />
        </Col>
        <Col md={2}>
          <Form.Select>
            <option>Todos los estados</option>
            <option>Borrador</option>
            <option>Confirmado</option>
            <option>Anulado</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" className="w-100">
            <Filter size={16} className="me-2" />
            Filtrar
          </Button>
        </Col>
      </Row>

      {/* Tabla */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Debe</th>
                <th>Haber</th>
                <th>Estado</th>
                <th width="120">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asientos.map((asiento) => (
                <tr key={asiento.id}>
                  <td>
                    <strong>{asiento.numero}</strong>
                  </td>
                  <td>{new Date(asiento.fecha).toLocaleDateString("es-AR")}</td>
                  <td>{asiento.descripcion}</td>
                  <td className="text-end">
                    <strong>${asiento.debe.toLocaleString("es-AR")}</strong>
                  </td>
                  <td className="text-end">
                    <strong>${asiento.haber.toLocaleString("es-AR")}</strong>
                  </td>
                  <td>
                    <Badge bg={asiento.estado === "CONFIRMADO" ? "success" : "warning"}>{asiento.estado}</Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm" onClick={() => setSelectedAsiento(asiento)}>
                        <FileText size={14} />
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <Edit size={14} />
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Nuevo Asiento */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Asiento Contable</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-4">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Número</Form.Label>
                  <Form.Control type="number" value="4" readOnly />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control type="text" placeholder="Descripción del asiento" />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mb-3">Movimientos</h5>
            <Table className="mb-3">
              <thead className="table-light">
                <tr>
                  <th>Cuenta</th>
                  <th width="150">Debe</th>
                  <th width="150">Haber</th>
                  <th width="100">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((mov, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Select>
                        <option>{mov.cuenta}</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control type="number" value={mov.debe || ""} placeholder="0.00" />
                    </td>
                    <td>
                      <Form.Control type="number" value={mov.haber || ""} placeholder="0.00" />
                    </td>
                    <td>
                      <Button variant="outline-danger" size="sm">
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4">
                    <Button variant="outline-primary" size="sm" className="w-100">
                      <Plus size={16} className="me-2" />
                      Agregar Movimiento
                    </Button>
                  </td>
                </tr>
              </tbody>
              <tfoot className="table-light">
                <tr>
                  <th>Totales:</th>
                  <th className="text-end">$10,000.00</th>
                  <th className="text-end">$10,000.00</th>
                  <th></th>
                </tr>
              </tfoot>
            </Table>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="outline-primary">Guardar Borrador</Button>
          <Button variant="primary">Confirmar Asiento</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Ver Asiento */}
      <Modal show={!!selectedAsiento} onHide={() => setSelectedAsiento(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Asiento N° {selectedAsiento?.numero}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAsiento && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Fecha:</strong> {new Date(selectedAsiento.fecha).toLocaleDateString("es-AR")}
                </Col>
                <Col md={6}>
                  <strong>Estado:</strong>{" "}
                  <Badge bg={selectedAsiento.estado === "CONFIRMADO" ? "success" : "warning"}>
                    {selectedAsiento.estado}
                  </Badge>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Descripción:</strong> {selectedAsiento.descripcion}
                </Col>
              </Row>
              <Table size="sm">
                <thead className="table-light">
                  <tr>
                    <th>Cuenta</th>
                    <th>Debe</th>
                    <th>Haber</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((mov, index) => (
                    <tr key={index}>
                      <td>{mov.cuenta}</td>
                      <td className="text-end">{mov.debe ? `$${mov.debe.toLocaleString("es-AR")}` : "-"}</td>
                      <td className="text-end">{mov.haber ? `$${mov.haber.toLocaleString("es-AR")}` : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedAsiento(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Asientos
