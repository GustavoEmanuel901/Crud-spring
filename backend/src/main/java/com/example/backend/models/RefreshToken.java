package com.example.backend.models;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Column(nullable = false, unique = true)
    private String token;
    
    @Column(nullable = false)
    private Instant expiryDate;
    
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean revogado = false;
    
    @Column(nullable = false)
    private Instant dataCriacao;
    
    @PrePersist
    protected void onCreate() {
        dataCriacao = Instant.now();
    }
    
    public RefreshToken() {}
    
    public RefreshToken(Usuario usuario, String token, Instant expiryDate) {
        this.usuario = usuario;
        this.token = token;
        this.expiryDate = expiryDate;
        this.revogado = false;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public Instant getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Instant expiryDate) { this.expiryDate = expiryDate; }
    
    public boolean isRevogado() { return revogado; }
    public void setRevogado(boolean revogado) { this.revogado = revogado; }
    
    public Instant getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(Instant dataCriacao) { this.dataCriacao = dataCriacao; }
    
    public boolean isExpirado() {
        return Instant.now().isAfter(expiryDate);
    }
    
    public boolean isAtivo() {
        return !revogado && !isExpirado();
    }
}