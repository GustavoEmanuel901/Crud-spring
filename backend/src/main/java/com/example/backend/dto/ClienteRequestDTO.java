package com.example.backend.dto;


import jakarta.validation.constraints.NotBlank;

public class ClienteRequestDTO {
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @NotBlank(message = "CPF é obrigatório")
    private String cpf;
    
    @NotBlank(message = "Endereço é obrigatório")
    private String endereco;
    
    public ClienteRequestDTO() {}
    
    public ClienteRequestDTO(String nome, String cpf, String endereco) {
        this.nome = nome;
        this.cpf = cpf;
        this.endereco = endereco;
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
