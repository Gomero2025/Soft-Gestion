package com.contable.entity;

import com.contable.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "empresas")
public class Empresa extends BaseEntity {
    
    @Column(name = "razon_social", nullable = false)
    private String razonSocial;
    
    @Column(name = "nombre_fantasia")
    private String nombreFantasia;
    
    @Column(name = "cuit", unique = true, nullable = false, length = 13)
    private String cuit;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_empresa_id", nullable = false)
    private TipoEmpresa tipoEmpresa;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_fiscal_id", nullable = false)
    private CategoriaFiscal categoriaFiscal;
    
    @Column(name = "fecha_inicio_actividades", nullable = false)
    private LocalDate fechaInicioActividades;
    
    @Column(name = "domicilio_fiscal", nullable = false, columnDefinition = "TEXT")
    private String domicilioFiscal;
    
    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jurisdiccion_id", nullable = false)
    private Jurisdiccion jurisdiccion;
    
    @Column(name = "telefono", length = 20)
    private String telefono;
    
    @Column(name = "email", nullable = false, length = 100)
    private String email;
    
    @Column(name = "email_secundario", length = 100)
    private String emailSecundario;
    
    @Column(name = "whatsapp", length = 20)
    private String whatsapp;
    
    @Column(name = "contacto_nombre", length = 100)
    private String contactoNombre;
    
    @Column(name = "contacto_cargo", length = 100)
    private String contactoCargo;
    
    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private Usuario createdBy;
    
    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PlanCuenta> planCuentas = new HashSet<>();
    
    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Asiento> asientos = new HashSet<>();
    
    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UsuarioEmpresa> usuarioEmpresas = new HashSet<>();
    
    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<EmpresaHistorico> historicos = new HashSet<>();
    
    public String getDisplayName() {
        return nombreFantasia != null && !nombreFantasia.trim().isEmpty() 
            ? nombreFantasia 
            : razonSocial;
    }
}
