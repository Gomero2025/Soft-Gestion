"use client"
import { Card } from "react-bootstrap"
import { Construction, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const EmptyPage = ({ title, description, icon: IconComponent = Construction }) => {
  const navigate = useNavigate()

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
      <Card className="border-0 shadow-sm text-center" style={{ maxWidth: "500px" }}>
        <Card.Body className="py-5">
          <div className="mb-4">
            <div className="bg-primary bg-opacity-10 rounded-circle p-4 d-inline-flex">
              <IconComponent className="text-primary" size={48} />
            </div>
          </div>
          <h3 className="mb-3">{title}</h3>
          <p className="text-muted mb-4">{description}</p>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} className="me-2" />
              Volver
            </button>
            <button className="btn btn-primary">Comenzar Desarrollo</button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default EmptyPage
