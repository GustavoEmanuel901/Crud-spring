package com.example.backend.controllers;

import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.RefreshTokenRequestDTO;
import com.example.backend.dto.TokenResponseDTO;
import com.example.backend.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "Endpoints para autenticação de usuários")
public class AuthController {
    
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping("/login")
    @Operation(summary = "Login de usuário", description = "Realiza login e retorna tokens JWT")
    public ResponseEntity<TokenResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        TokenResponseDTO tokenResponse = authService.login(loginRequest);
        return ResponseEntity.ok(tokenResponse);
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Gera novos tokens usando refresh token")
    public ResponseEntity<TokenResponseDTO> refreshToken(@Valid @RequestBody RefreshTokenRequestDTO refreshTokenRequest) {
        TokenResponseDTO tokenResponse = authService.refreshToken(refreshTokenRequest);
        return ResponseEntity.ok(tokenResponse);
    }
    
    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Revoga o refresh token atual")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequestDTO refreshTokenRequest) {
        authService.logout(refreshTokenRequest.getRefreshToken());
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/logout-all")
    @Operation(summary = "Logout de todas as sessões", description = "Revoga todos os tokens do usuário")
    public ResponseEntity<Void> logoutAll(Authentication authentication) {
        authService.logoutAll(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}