# Backend API

Backend REST API desenvolvido com Spring Boot para gerenciamento de clientes e autenticação JWT.

## 📋 Visão Geral

Este projeto implementa uma API REST segura com autenticação JWT, gerenciamento de clientes e suporte para refresh tokens. A aplicação utiliza MySQL como banco de dados e está configurada para ser integrada com aplicações frontend via CORS.

## 🔧 Requisitos

- **Java**: JDK 17+
- **Maven**: 3.6+
- **MySQL**: 8.0+
- **Spring Boot**: 3.2.0

## 📦 Dependências Principais

```xml
- spring-boot-starter-web: Framework web
- spring-boot-starter-security: Segurança
- spring-boot-starter-data-jpa: ORM Hibernate
- mysql-connector-java: Driver MySQL
- jjwt: JSON Web Tokens
- springdoc-openapi-starter-webmvc-ui: Swagger/OpenAPI
```

## 🗂️ Estrutura do Projeto

```
src/main/java/com/example/backend/
├── config/
│   ├── DataInitializer.java       # Inicialização de dados padrão
│   ├── OpenApiConfig.java         # Configuração Swagger
│   └── SecurityConfig.java        # Configuração de segurança
├── controllers/
│   ├── AuthController.java        # Endpoints de autenticação
│   └── ClienteController.java     # Endpoints de clientes
├── dto/
│   ├── ClienteRequestDTO.java
│   ├── ClienteResponseDTO.java
│   ├── LoginRequestDTO.java
│   ├── RefreshTokenRequestDTO.java
│   └── TokenResponseDTO.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── TokenException.java
├── models/
│   ├── Cliente.java
│   ├── RefreshToken.java
│   └── Usuario.java
├── repositories/
│   ├── ClienteRepository.java
│   ├── RefreshTokenRepository.java
│   └── UsuarioRepository.java
├── security/
│   ├── JwtAuthenticationFilter.java
│   └── JwtService.java
└── services/
    ├── AuthService.java
    ├── ClienteService.java
    └── UsuarioService.java
```

## ⚙️ Configuração

### 1. Banco de Dados

Crie o banco de dados MySQL:

```sql
CREATE DATABASE clients_db;
```

### 2. Variáveis de Ambiente (application.properties)

```properties
server.port=8080

spring.application.name=backend

# Banco de Dados
spring.datasource.url=jdbc:mysql://localhost:3306/clients_db
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=sua_senha

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
app.security.jwt.secret=sua_chave_secreta_com_32_caracteres_minimo
app.security.jwt.expiration=900000
app.security.jwt.refresh-expiration=86400000

# Swagger/OpenAPI
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

### 3. Compilação e Execução

```bash
# Compilar o projeto
mvn clean install

# Executar a aplicação
mvn spring-boot:run

# Ou usar o JAR gerado
java -jar target/backend-1.0.0.jar
```

A aplicação estará disponível em `http://localhost:8080`

## 🔐 Autenticação

### Login

**POST** `/api/auth/login`

```json
{
  "username": "usuario_teste",
  "password": "senha123"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer"
}
```

### Refresh Token

**POST** `/api/auth/refresh`

```json
{
  "refreshToken": "seu_refresh_token_aqui"
}
```

### Uso do Token

Adicione o token em todas as requisições protegidas:

```
Authorization: Bearer seu_token_aqui
```

## 📚 Endpoints

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/auth/login` | Fazer login | ❌ |
| POST | `/api/auth/refresh` | Renovar token | ❌ |

### Clientes

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/clientes` | Listar todos os clientes | ✅ |
| GET | `/api/clientes/{id}` | Obter cliente por ID | ✅ |
| POST | `/api/clientes` | Criar novo cliente | ✅ |
| PUT | `/api/clientes/{id}` | Atualizar cliente | ✅ |
| DELETE | `/api/clientes/{id}` | Deletar cliente | ✅ |

### Exemplo de Uso

**GET** `/api/clientes`

```bash
curl -H "Authorization: Bearer seu_token" http://localhost:8080/api/clientes
```

**POST** `/api/clientes`

```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "11999999999"
}
```

## 🛡️ Segurança

- **JWT (JSON Web Tokens)**: Autenticação stateless
- **Refresh Tokens**: Para renovar access tokens sem re-autenticar
- **CORS**: Configurado para aceitar requisições do frontend em `http://localhost:5173` e `http://localhost:3000`
- **Password Encoding**: NoOpPasswordEncoder (⚠️ apenas para desenvolvimento)
- **CSRF Protection**: Desabilitado para API REST

### ⚠️ Importante para Produção

- Alterar `NoOpPasswordEncoder` para `BCryptPasswordEncoder`
- Usar uma chave JWT segura de 32+ caracteres
- Habilitar HTTPS
- Configurar rate limiting
- Validar e sanitizar inputs

## 📖 Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:8080/swagger-ui.html
```

API Docs (JSON):
```
http://localhost:8080/api-docs
```

## 🐛 Tratamento de Erros

A API retorna erros estruturados:

```json
{
  "timestamp": "2026-02-01T23:00:00.000Z",
  "status": 404,
  "error": "Not Found",
  "message": "Cliente não encontrado",
  "path": "/api/clientes/999"
}
```

## 🚀 Features

✅ Autenticação com JWT  
✅ Refresh Token automático  
✅ CORS configurado  
✅ Validação de dados com DTOs  
✅ Tratamento centralizado de exceções  
✅ Documentação Swagger/OpenAPI  
✅ Inicialização automática de dados  
✅ Logging com Spring Boot  

## 📝 Modelos de Dados

### Usuario
- `id`: Long (PK)
- `username`: String (unique)
- `senha`: String

### Cliente
- `id`: Long (PK)
- `nome`: String
- `email`: String
- `telefone`: String
- `dataCriacao`: Instant

### RefreshToken
- `id`: Long (PK)
- `token`: String (unique)
- `usuario`: ManyToOne
- `expiryDate`: Instant
- `dataCriacao`: Instant
- `revogado`: Boolean

## 🔌 CORS

Requisições frontend são aceitas de:
- `http://localhost:5173` (Vite)
- `http://localhost:3000` (React Dev Server)

Para adicionar mais origens, edite `SecurityConfig.java`:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "http://localhost:3000",
    "https://seu-dominio.com"
));
```

## 🧪 Testando a API

### Com cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","password":"123"}'

# Listar clientes
curl -H "Authorization: Bearer seu_token" \
  http://localhost:8080/api/clientes
```

### Com Postman

1. Fazer login em `/api/auth/login`
2. Copiar o `accessToken`
3. Criar uma variável de ambiente: `{{token}}`
4. Adicionar ao header: `Authorization: Bearer {{token}}`

## 📋 Roadmap

- [ ] Implementar BCryptPasswordEncoder
- [ ] Adicionar testes unitários
- [ ] Implementar paginação
- [ ] Adicionar filtros avançados
- [ ] Implementar auditoria
- [ ] Cache com Redis
- [ ] Métodos de pagamento

## 📄 Licença

Este projeto é de uso educacional.

## 👥 Autores

Desenvolvido para o projeto Pinhais.

---

**Última atualização**: Fevereiro de 2026
