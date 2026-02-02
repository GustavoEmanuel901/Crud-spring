package com.example.backend.services;

import com.example.backend.models.Usuario;
import com.example.backend.repositories.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService implements UserDetailsService {
    
    private final UsuarioRepository usuarioRepository;
    
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
        
        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getSenha())
                .authorities("USER")
                .build();
    }
    
    public Usuario criarUsuario(String username, String senha) {
        Usuario usuario = new Usuario(username, senha);
        return usuarioRepository.save(usuario);
    }
}