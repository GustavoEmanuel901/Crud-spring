package com.example.backend.models;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table(name = "clientes")
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    
    private String nome;

    private String cpf;

    private String endereco;

    public Cliente() {

    }

    public Cliente(Long id, String nome, String cpf, String endereco) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.endereco = endereco;
    }

    public Long getId() {
        return id;
    }   

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }   

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }   

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }   


    public String getEndereco() {
        return endereco;
    }   

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
}
