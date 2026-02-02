package com.example.backend.controllers;

import com.example.backend.dto.ClienteRequestDTO;
import com.example.backend.dto.ClienteResponseDTO;
import com.example.backend.services.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@Tag(name = "Clientes", description = "Endpoints para gerenciamento de clientes")
@SecurityRequirement(name = "bearerAuth")
public class ClienteController {
    
    private final ClienteService clienteService;
    
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }
    
    @GetMapping
    @Operation(summary = "Listar todos os clientes", description = "Retorna uma lista de todos os clientes cadastrados")
    public ResponseEntity<List<ClienteResponseDTO>> findAll() {
        List<ClienteResponseDTO> clientes = clienteService.findAll();
        return ResponseEntity.ok(clientes);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Buscar cliente por ID", description = "Retorna um cliente específico pelo seu ID")
    public ResponseEntity<ClienteResponseDTO> findById(@PathVariable Long id) {
        ClienteResponseDTO cliente = clienteService.findById(id);
        return ResponseEntity.ok(cliente);
    }
    
    @PostMapping
    @Operation(summary = "Criar novo cliente", description = "Cadastra um novo cliente no sistema")
    public ResponseEntity<ClienteResponseDTO> create(@Valid @RequestBody ClienteRequestDTO clienteRequest) {
        ClienteResponseDTO cliente = clienteService.create(clienteRequest);
        return new ResponseEntity<>(cliente, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar cliente", description = "Atualiza os dados de um cliente existente")
    public ResponseEntity<ClienteResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ClienteRequestDTO clienteRequest) {
        ClienteResponseDTO cliente = clienteService.update(id, clienteRequest);
        return ResponseEntity.ok(cliente);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir cliente", description = "Remove um cliente do sistema")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clienteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}