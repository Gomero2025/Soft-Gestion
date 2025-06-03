// DTOs para el Dashboard
export class DashboardDTO {
  constructor() {
    this.empresa = ""
    this.vencimientosProximos = []
    this.indicadores = new IndicadoresDTO()
    this.alertasInconsistencias = []
  }
}

export class IndicadoresDTO {
  constructor() {
    this.posicionIva = 0
    this.ivaDebito = 0
    this.ivaCredito = 0
    this.saldoIIBB = 0
    this.saldoGanancias = 0
  }
}

export class VencimientoDTO {
  constructor() {
    this.id = null
    this.descripcion = ""
    this.fechaVencimiento = null
    this.montoEstimado = 0
    this.estado = ""
    this.tipoImpuesto = ""
    this.diasRestantes = 0
  }
}
