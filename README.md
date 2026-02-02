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

# Frontend

Sistema web moderno para gerenciamento de clientes com autenticação segura, CRUD completo e integração com API de CEP.

## 🎯 Funcionalidades

- ✅ **Autenticação Segura**
  - Login com validação de credenciais
  - Sistema de Refresh Token para renovação automática de acesso
  - Tokens armazenados de forma segura
  - Redirecionamento automático em caso de expiração

- ✅ **Gestão de Clientes (CRUD)**
  - Criar novo cliente
  - Listar clientes cadastrados em tabela interativa
  - Editar informações de cliente
  - Deletar cliente com confirmação

- ✅ **Busca de CEP Automática**
  - Campo CEP que busca dados da API ViaCEP
  - Auto-preenchimento de endereço
  - Debounce de 500ms para otimização
  - Validação de CEP em tempo real

- ✅ **Interface Responsiva**
  - Design mobile-first
  - Tailwind CSS para estilização
  - Componentes reutilizáveis
  - Notificações em tempo real (Sonner)

- ✅ **Proteção de Rotas**
  - Rotas privadas apenas para usuários autenticados
  - Rota pública de login bloqueada para usuários logados
  - Logout com limpeza completa de tokens

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca para UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Roteamento de páginas
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Client HTTP
- **Sonner** - Notificações toast
- **Lucide React** - Ícones
- **TanStack React Table** - Tabelas avançadas

### Backend (Esperado)
- Node.js/Express ou similar
- JWT para autenticação
- Refresh tokens
- Endpoints CRUD de clientes

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Backend rodando em `http://localhost:8080/api`

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <repositorio>
cd pinhais-web
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Tailwind CSS**
```bash
npm i tailwindcss @tailwindcss/vite
```

4. **Instale as dependências adicionais**
```bash
npm i sonner axios react-router-dom react-hook-form zod @hookform/resolvers lucide-react
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto (se necessário):

```env
VITE_API_URL=http://localhost:8080/api
```

### API Base URL

A URL da API está configurada em `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});
```

Altere conforme necessário para seu ambiente.

## 📖 Como Executar

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador

### Build para Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── DataTable.tsx              # Tabela reutilizável
│   ├── DialogFormWrapper.tsx      # Wrapper para diálogos de formulário
│   ├── FormCliente.tsx            # Formulário de cadastro
│   ├── FormClienteEdit.tsx        # Formulário de edição
│   ├── FormLogin.tsx              # Formulário de login
│   ├── Header.tsx                 # Cabeçalho com botão logout
│   ├── Input.tsx                  # Componente de input customizado
│   └── ui/                        # Componentes base (Shadcn UI)
├── pages/
│   ├── Login.tsx                  # Página de login
│   └── Cliente.tsx                # Página de gestão de clientes
├── routes/
│   ├── PrivateRoute.tsx           # Rota protegida para usuários autenticados
│   └── PublicRoute.tsx            # Rota protegida para não autenticados
├── schemas/
│   ├── login.schema.ts            # Validação de login
│   └── cliente.schema.ts          # Validação de cliente
├── services/
│   ├── api.ts                     # Cliente HTTP com interceptadores
│   └── cepService.ts              # Serviço para busca de CEP
├── types/
│   └── types.ts                   # Tipos TypeScript compartilhados
├── utils/
│   ├── columns.tsx                # Definição de colunas da tabela
│   ├── tokenManager.ts            # Gerenciamento de tokens
│   ├── apiError.ts                # Tratamento de erros de API
│   └── cssRewritingPlugin.ts      # Plugin de CSS
├── App.tsx                        # Componente raiz com rotas
├── main.tsx                       # Entrada da aplicação
└── index.css                      # Estilos globais
```

## 🔐 Autenticação e Segurança

### Fluxo de Login

1. Usuário insere credenciais
2. POST `/auth/login` com username e senha
3. Backend retorna `token` e `refreshToken`
4. Tokens armazenados no localStorage
5. Redirecionamento para `/cliente`

### Refresh Token

O sistema implementa refresh automático:

1. Requisição retorna 401 (token expirado)
2. Interceptor tenta renovar com `refreshToken`
3. Se bem-sucedido, requisição é retentada com novo token
4. Se falhar, usuário é desconectado e redirecionado para login

### Proteção de Rotas

- **PrivateRoute**: Apenas usuários autenticados
- **PublicRoute**: Apenas usuários não autenticados (login)

## 📡 API Endpoints Esperados

### Autenticação
```
POST /auth/login
  Body: { username, senha }
  Response: { token, refreshToken }

POST /auth/refresh
  Body: { refreshToken }
  Response: { token, refreshToken }
```

### Clientes
```
GET /clientes
  Headers: Authorization: Bearer <token>
  Response: Client[]

POST /clientes
  Headers: Authorization: Bearer <token>
  Body: { nome, cpf, endereco }
  Response: { id, nome, cpf, endereco }

PUT /clientes/:id
  Headers: Authorization: Bearer <token>
  Body: { nome, cpf, endereco }
  Response: { id, nome, cpf, endereco }

DELETE /clientes/:id
  Headers: Authorization: Bearer <token>
  Response: { success: true }
```

## 📝 Validações

### Cliente
- **Nome**: Mínimo 3 caracteres
- **CPF**: Formato XXX.XXX.XXX-XX
- **CEP**: Formato XXXXX-XXX (buscado automaticamente na ViaCEP)
- **Endereço**: Mínimo 5 caracteres, preenchido automaticamente via CEP

### Login
- **Username**: Obrigatório
- **Senha**: Obrigatório

## 🔧 Serviços Externos

### ViaCEP
API pública para busca de CEP brasileiro

```
GET https://viacep.com.br/ws/{cep}/json/
```

Retorna informações de logradouro, bairro, cidade, estado, etc.

## 🎨 Componentes Principais

### DataTable
Tabela interativa com suporte a:
- Seleção de linhas
- Tipos de coluna: normal, badge, object, action
- Carregamento
- Paginação

### DialogFormWrapper
Wrapper para formulários em diálogo:
- Cabeçalho e rodapé customizáveis
- Botão submit no rodapé
- Estado de carregamento

### Input
Componente de input reutilizável:
- Validação com react-hook-form
- Toggle para visualização de senha
- Estados disabled e error
- Labels com indicação de obrigatoriedade

## 📱 Design Responsivo

- **Mobile**: Layouts empilhados, botões maiores
- **Tablet**: Ajustes de padding e fonts
- **Desktop**: Layout completo com múltiplas colunas

## 🐛 Tratamento de Erros

- Erros de API mostrados via toast (Sonner)
- Validação em tempo real de formulários
- Mensagens amigáveis para o usuário
- Logs em console para debug

## 📦 Scripts NPM

```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Faz build para produção
npm run preview   # Visualiza build de produção
npm run lint      # Executa linter
```


