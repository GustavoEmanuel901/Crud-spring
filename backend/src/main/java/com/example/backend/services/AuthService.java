package com.example.backend.services;

import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.RefreshTokenRequestDTO;
import com.example.backend.dto.TokenResponseDTO;
import com.example.backend.exception.TokenException;
import com.example.backend.models.RefreshToken;
import com.example.backend.models.Usuario;
import com.example.backend.repositories.RefreshTokenRepository;
import com.example.backend.repositories.UsuarioRepository;
import com.example.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UsuarioRepository usuarioRepository;
    
    public AuthService(AuthenticationManager authenticationManager, 
                      JwtService jwtService, 
                      UsuarioService usuarioService,
                      RefreshTokenRepository refreshTokenRepository,
                      UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioService = usuarioService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.usuarioRepository = usuarioRepository;
    }
    
    @Transactional
    public TokenResponseDTO login(LoginRequestDTO loginRequest) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getSenha()
            )
        );
        
        UserDetails userDetails = usuarioService.loadUserByUsername(loginRequest.getUsername());
        Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Revoga tokens antigos
        refreshTokenRepository.deleteByUsuario(usuario);
        
        // Gera novo token JWT
        String token = jwtService.generateToken(userDetails);
        
        // Gera e salva refresh token
        RefreshToken refreshToken = createRefreshToken(usuario);
        refreshTokenRepository.save(refreshToken);
        
        return new TokenResponseDTO(token, refreshToken.getToken());
    }
    
    @Transactional
    public TokenResponseDTO refreshToken(RefreshTokenRequestDTO refreshTokenRequest) {
        String requestRefreshToken = refreshTokenRequest.getRefreshToken();
        
        // Busca o refresh token no banco
        RefreshToken refreshToken = refreshTokenRepository.findByToken(requestRefreshToken)
                .orElseThrow(() -> new TokenException("Refresh token não encontrado"));
        
        // Verifica se está ativo
        if (!refreshToken.isAtivo()) {
            throw new TokenException("Refresh token expirado ou revogado");
        }
        
        // Revoga o token atual
        refreshToken.setRevogado(true);
        refreshTokenRepository.save(refreshToken);
        
        // Busca o usuário
        Usuario usuario = refreshToken.getUsuario();
        UserDetails userDetails = usuarioService.loadUserByUsername(usuario.getUsername());
        
        // Gera novo token JWT
        String newToken = jwtService.generateToken(userDetails);
        
        // Gera novo refresh token
        RefreshToken newRefreshToken = createRefreshToken(usuario);
        refreshTokenRepository.save(newRefreshToken);
        
        return new TokenResponseDTO(newToken, newRefreshToken.getToken());
    }
    
    @Transactional
    public void logout(String refreshToken) {
        // Busca e revoga o refresh token
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(token -> {
                    token.setRevogado(true);
                    refreshTokenRepository.save(token);
                });
    }
    
    @Transactional
    public void logoutAll(String username) {
        // Revoga todos os tokens do usuário
        usuarioRepository.findByUsername(username)
                .ifPresent(refreshTokenRepository::deleteByUsuario);
    }
    
    private RefreshToken createRefreshToken(Usuario usuario) {
        // Gera um token único (pode ser UUID ou JWT)
        String token = UUID.randomUUID().toString();
        
        // Define expiração (7 dias por exemplo)
        Instant expiryDate = Instant.now().plusSeconds(7 * 24 * 60 * 60);
        
        return new RefreshToken(usuario, token, expiryDate);
    }
}