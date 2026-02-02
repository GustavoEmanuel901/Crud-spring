package com.example.backend.models;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario  {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String senha;
    
    public Usuario() {}
    
    public Usuario(String username, String senha) {
        this.username = username;
        this.senha = senha;
    }
    
   
    public String getSenha() {
        return senha;
    }
    
    public String getUsername() {
        return username;
    }
    
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public void setSenha(String senha) {
        this.senha = senha;
    }
    
}