package com.example.backend.services;

import com.example.backend.dto.ClienteRequestDTO;
import com.example.backend.dto.ClienteResponseDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.models.Cliente;
import com.example.backend.repositories.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {
    
    private final ClienteRepository clienteRepository;
    
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    
    public List<ClienteResponseDTO> findAll() {
        return clienteRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    public ClienteResponseDTO findById(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
        return toResponseDTO(cliente);
    }
    
    public ClienteResponseDTO create(ClienteRequestDTO clienteRequest) {
        if (clienteRepository.existsByCpf(clienteRequest.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }
        
        Cliente cliente = new Cliente();
        cliente.setNome(clienteRequest.getNome());
        cliente.setCpf(clienteRequest.getCpf());
        cliente.setEndereco(clienteRequest.getEndereco());
        
        Cliente savedCliente = clienteRepository.save(cliente);
        return toResponseDTO(savedCliente);
    }
    
    public ClienteResponseDTO update(Long id, ClienteRequestDTO clienteRequest) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
        
        // Verifica se o CPF já existe em outro cliente
        if (!cliente.getCpf().equals(clienteRequest.getCpf()) &&
            clienteRepository.existsByCpf(clienteRequest.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }
        
        cliente.setNome(clienteRequest.getNome());
        cliente.setCpf(clienteRequest.getCpf());
        cliente.setEndereco(clienteRequest.getEndereco());
        
        Cliente updatedCliente = clienteRepository.save(cliente);
        return toResponseDTO(updatedCliente);
    }
    
    public void delete(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente não encontrado com id: " + id);
        }
        clienteRepository.deleteById(id);
    }
    
    private ClienteResponseDTO toResponseDTO(Cliente cliente) {
        return new ClienteResponseDTO(
            cliente.getId(),
            cliente.getNome(),
            cliente.getCpf(),
            cliente.getEndereco()
        );
    }
}