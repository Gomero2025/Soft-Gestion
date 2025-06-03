"use client"
import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap"
import { Eye, EyeOff, Lock, User, Shield } from "lucide-react"
import { authService } from "../../services/authService"

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Limpiar error al escribir
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validaciones básicas
      if (!formData.username.trim()) {
        throw new Error("El nombre de usuario es requerido")
      }
      if (!formData.password.trim()) {
        throw new Error("La contraseña es requerida")
      }

      const response = await authService.login({
        username: formData.username.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      })

      // Guardar datos de sesión
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))

      if (formData.rememberMe) {
        localStorage.setItem("rememberUser", formData.username)
      } else {
        localStorage.removeItem("rememberUser")
      }

      // Callback de éxito
      if (onLoginSuccess) {
        onLoginSuccess(response.user)
      }
    } catch (err) {
      setAttempts((prev) => prev + 1)

      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos")
      } else if (err.response?.status === 423) {
        setError("Usuario bloqueado por múltiples intentos fallidos. Contacte al administrador.")
      } else if (err.response?.status === 403) {
        setError("Usuario inactivo. Contacte al administrador.")
      } else {
        setError(err.message || "Error al iniciar sesión. Intente nuevamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Cargar usuario recordado al montar el componente
  useState(() => {
    const rememberedUser = localStorage.getItem("rememberUser")
    if (rememberedUser) {
      setFormData((prev) => ({
        ...prev,
        username: rememberedUser,
        rememberMe: true,
      }))
    }
  }, [])

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <Shield className="text-primary" size={32} />
                </div>
                <h3 className="fw-bold mb-1">Sistema Contable</h3>
                <p className="text-muted mb-0">Ingrese sus credenciales</p>
              </div>

              {/* Alerta de error */}
              {error && (
                <Alert variant="danger" className="mb-4">
                  <Lock className="me-2" size={16} />
                  {error}
                </Alert>
              )}

              {/* Alerta de intentos */}
              {attempts >= 3 && (
                <Alert variant="warning" className="mb-4">
                  <Shield className="me-2" size={16} />
                  Múltiples intentos fallidos detectados. Su cuenta puede ser bloqueada.
                </Alert>
              )}

              {/* Formulario */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <User size={16} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Ingrese su usuario"
                      disabled={loading}
                      autoComplete="username"
                      autoFocus
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <Lock size={16} />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Ingrese su contraseña"
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={togglePasswordVisibility}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    label="Recordar usuario"
                    disabled={loading}
                  />
                </Form.Group>

                <Button type="submit" variant="primary" size="lg" className="w-100 mb-3" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </Form>

              {/* Footer */}
              <div className="text-center">
                <small className="text-muted">
                  ¿Olvidó su contraseña?{" "}
                  <Button variant="link" size="sm" className="p-0">
                    Contacte al administrador
                  </Button>
                </small>
              </div>
            </Card.Body>
          </Card>

          {/* Información del sistema */}
          <div className="text-center mt-4">
            <small className="text-muted">
              Sistema Contable Argentino v1.0.0
              <br />
              Cumple con normativas AFIP y NE3
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginForm
