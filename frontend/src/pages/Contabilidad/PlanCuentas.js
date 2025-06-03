"use client"
import { useState } from "react"
import { Row, Col, Card, Button, Table, Form, InputGroup, Badge, Modal } from "react-bootstrap"
import { Plus, Search, Edit, Trash2, FolderTree, Download, Upload } from "lucide-react"

const PlanCuentas = () => {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de ejemplo
  const cuentas = [
    { id: 1, codigo: "1", descripcion: "ACTIVO", nivel: 1, imputable: false, tipo: "ACTIVO" },
    { id: 2, codigo: "1.1", descripcion: "ACTIVO CORRIENTE", nivel: 2, imputable: false, tipo: "ACTIVO" },
    { id: 3, codigo: "1.1.01", descripcion: "Caja", nivel: 3, imputable: true, tipo: "ACTIVO" },
    { id: 4, codigo: "1.1.02", descripcion: "Banco Nación", nivel: 3, imputable: true, tipo: "ACTIVO" },
    { id: 5, codigo: "2", descripcion: "PASIVO", nivel: 1, imputable: false, tipo: "PASIVO" },
    { id: 6, codigo: "2.1", descripcion: "PASIVO CORRIENTE", nivel: 2, imputable: false, tipo: "PASIVO" },
  ]

  return (
    <div>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Plan de Cuentas</h2>
              <p className="text-muted mb-0">Gestión del plan de cuentas contable</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" size="sm">
                <Download size={16} className="me-2" />
                Exportar
              </Button>
              <Button variant="outline-primary" size="sm">
                <Upload size={16} className="me-2" />
                Importar
              </Button>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <Plus size={16} className="me-2" />
                Nueva Cuenta
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por código o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <div className="d-flex gap-2">
            <Form.Select size="sm">
              <option>Todos los tipos</option>
              <option>Activo</option>
              <option>Pasivo</option>
              <option>Patrimonio</option>
              <option>Ingresos</option>
              <option>Egresos</option>
            </Form.Select>
            <Form.Check type="checkbox" label="Solo imputables" />
          </div>
        </Col>
      </Row>

      {/* Tabla */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Nivel</th>
                <th>Estado</th>
                <th width="120">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuentas.map((cuenta) => (
                <tr key={cuenta.id}>
                  <td>
                    <code className="text-primary">{cuenta.codigo}</code>
                  </td>
                  <td>
                    <div style={{ paddingLeft: `${(cuenta.nivel - 1) * 20}px` }}>
                      {cuenta.nivel > 1 && <FolderTree size={14} className="me-2 text-muted" />}
                      {cuenta.descripcion}
                    </div>
                  </td>
                  <td>
                    <Badge bg="outline-secondary">{cuenta.tipo}</Badge>
                  </td>
                  <td>{cuenta.nivel}</td>
                  <td>
                    <Badge bg={cuenta.imputable ? "success" : "secondary"}>
                      {cuenta.imputable ? "Imputable" : "No Imputable"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm">
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

      {/* Modal Nueva Cuenta */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nueva Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código</Form.Label>
                  <Form.Control type="text" placeholder="Ej: 1.1.01" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cuenta Padre</Form.Label>
                  <Form.Select>
                    <option>Seleccionar cuenta padre...</option>
                    <option>1.1 - ACTIVO CORRIENTE</option>
                    <option>2.1 - PASIVO CORRIENTE</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control type="text" placeholder="Descripción de la cuenta" />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Cuenta</Form.Label>
                  <Form.Select>
                    <option>Seleccionar tipo...</option>
                    <option>Activo Corriente</option>
                    <option>Activo No Corriente</option>
                    <option>Pasivo Corriente</option>
                    <option>Pasivo No Corriente</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Configuración</Form.Label>
                  <div>
                    <Form.Check type="checkbox" label="Cuenta imputable" className="mb-2" />
                    <Form.Check type="checkbox" label="Ajustable por inflación" className="mb-2" />
                    <Form.Check type="checkbox" label="Centro de costo obligatorio" />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary">Guardar Cuenta</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default PlanCuentas
