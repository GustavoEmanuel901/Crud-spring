package com.example.backend.config;

import com.example.backend.models.Usuario;
import com.example.backend.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final UsuarioRepository usuarioRepository;
    
    public DataInitializer(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        // Cria um usuário padrão se não existir
        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            Usuario usuario = new Usuario("admin", "admin123");
            usuarioRepository.save(usuario);
            System.out.println("Usuário padrão criado: admin / admin123");
        }
    }
}