"use client"
import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Badge, Alert } from "react-bootstrap"
import { Building2, Search, ChevronRight, Users } from "lucide-react"
import { empresaService } from "../../services/empresaService"

const EmpresaSelector = ({ user, onEmpresaSelected }) => {
  const [empresas, setEmpresas] = useState([])
  const [filteredEmpresas, setFilteredEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmpresa, setSelectedEmpresa] = useState(null)

  useEffect(() => {
    loadEmpresas()
  }, [])

  useEffect(() => {
    filterEmpresas()
  }, [searchTerm, empresas])

  const loadEmpresas = async () => {
    try {
      setLoading(true)
      const response = await empresaService.getEmpresasUsuario()
      setEmpresas(response.data)

      // Si solo hay una empresa, seleccionarla automáticamente
      if (response.data.length === 1) {
        handleEmpresaSelect(response.data[0])
      }
    } catch (err) {
      setError("Error al cargar las empresas disponibles")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterEmpresas = () => {
    if (!searchTerm.trim()) {
      setFilteredEmpresas(empresas)
      return
    }

    const filtered = empresas.filter(
      (empresa) =>
        empresa.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.nombreFantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.cuit.includes(searchTerm),
    )
    setFilteredEmpresas(filtered)
  }

  const handleEmpresaSelect = (empresa) => {
    setSelectedEmpresa(empresa)

    // Guardar empresa seleccionada
    localStorage.setItem("empresaSeleccionada", JSON.stringify(empresa))

    // Callback
    if (onEmpresaSelected) {
      onEmpresaSelected(empresa)
    }
  }

  const getCategoriaFiscalBadge = (categoria) => {
    const variants = {
      RI: "primary",
      MONO: "success",
      EX: "warning",
      NI: "secondary",
      CF: "info",
    }
    return variants[categoria] || "secondary"
  }

  if (loading) {
    return (
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando empresas disponibles...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="min-vh-100 bg-light py-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={8} xl={6}>
          {/* Header */}
          <div className="text-center mb-5">
            <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
              <Building2 className="text-primary" size={32} />
            </div>
            <h2 className="fw-bold mb-2">Seleccionar Empresa</h2>
            <p className="text-muted mb-0">
              Bienvenido, <strong>{user?.nombreCompleto}</strong>
              <br />
              Seleccione la empresa con la que desea trabajar
            </p>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Búsqueda */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <Form.Group>
                <div className="position-relative">
                  <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                  <Form.Control
                    type="text"
                    placeholder="Buscar por razón social, nombre de fantasía o CUIT..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ps-5"
                  />
                </div>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Lista de empresas */}
          {filteredEmpresas.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <Building2 size={48} className="text-muted mb-3" />
                <h5 className="text-muted mb-2">No se encontraron empresas</h5>
                <p className="text-muted mb-0">
                  {searchTerm ? "Intente con otros términos de búsqueda" : "No tiene empresas asignadas"}
                </p>
              </Card.Body>
            </Card>
          ) : (
            <div className="row g-3">
              {filteredEmpresas.map((empresa) => (
                <div key={empresa.id} className="col-12">
                  <Card
                    className={`border-0 shadow-sm cursor-pointer transition-all ${
                      selectedEmpresa?.id === empresa.id ? "border-primary shadow" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEmpresaSelect(empresa)}
                  >
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <Building2 className="text-primary" size={20} />
                            </div>
                            <div>
                              <h5 className="mb-0 fw-bold">{empresa.displayName}</h5>
                              {empresa.nombreFantasia && empresa.nombreFantasia !== empresa.razonSocial && (
                                <small className="text-muted">{empresa.razonSocial}</small>
                              )}
                            </div>
                          </div>

                          <div className="row g-2 mb-2">
                            <div className="col-auto">
                              <Badge bg={getCategoriaFiscalBadge(empresa.categoriaFiscal?.codigo)}>
                                {empresa.categoriaFiscal?.descripcion}
                              </Badge>
                            </div>
                            <div className="col-auto">
                              <Badge bg="outline-secondary">CUIT: {empresa.cuit}</Badge>
                            </div>
                          </div>

                          <div className="text-muted small">
                            <div className="mb-1">
                              <strong>Domicilio:</strong> {empresa.domicilioFiscal}
                            </div>
                            <div>
                              <strong>Email:</strong> {empresa.email}
                            </div>
                          </div>
                        </div>

                        <div className="ms-3">
                          <ChevronRight className="text-muted" size={24} />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Información adicional */}
          <div className="text-center mt-5">
            <div className="d-flex align-items-center justify-content-center text-muted">
              <Users size={16} className="me-2" />
              <small>
                {filteredEmpresas.length} empresa{filteredEmpresas.length !== 1 ? "s" : ""} disponible
                {filteredEmpresas.length !== 1 ? "s" : ""}
              </small>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default EmpresaSelector
