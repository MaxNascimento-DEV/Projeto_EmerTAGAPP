# EmerTag - Backend

> **Cuidado que chega antes.**

API REST do **EmerTag**, um aplicativo que disponibiliza informações médicas críticas de forma rápida e segura em situações de emergência, via **QR Code**, conectando a pessoa protegida à sua rede de cuidado. Quem presta o socorro **não precisa criar conta nem instalar nada**: basta escanear o QR Code e a página de emergência abre no navegador.

Projeto acadêmico desenvolvido para a faculdade (Análise e Desenvolvimento de Sistemas).

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Modelo de dados](#modelo-de-dados)
- [Como executar](#como-executar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
- [Tratamento de erros](#tratamento-de-erros)
- [Segurança](#segurança)
- [Roadmap](#roadmap)

---

## Funcionalidades

- **Cadastro e login** de usuários com senha criptografada (BCrypt) e autenticação via **JWT**.
- **Perfis de emergência** para si mesmo (`PROPRIO`) ou para outra pessoa (`PROTEGIDO`).
- **Informações de saúde** por categoria: alergias, condições de saúde, medicamentos, necessidades específicas e biossegurança.
- **Contatos de emergência** por perfil.
- **Privacidade granular**: o administrador escolhe quais categorias aparecem na página pública.
- **Acesso público por QR Code**: um token aleatório e não sequencial dá acesso a uma versão filtrada do perfil, sem login.
- **Regeneração do token**, invalidando o QR Code anterior.
- **Rede de cuidado**: convites por e-mail, com permissões por cuidador (`podeVisualizarPrivado` e `podeEditar`).
- **Configurações de acessibilidade** (tamanho do texto e alto contraste) por usuário.

## Tecnologias

| Camada         | Tecnologia                             |
| -------------- | -------------------------------------- |
| Linguagem      | Java 21                                |
| Framework      | Spring Boot 4.1.1                      |
| Persistência   | Spring Data JPA (Hibernate)            |
| Banco de dados | MySQL 8                                |
| Migrations     | Flyway                                 |
| Segurança      | Spring Security + JWT (JJWT 0.12.6)    |
| Validação      | Bean Validation (`jakarta.validation`) |
| Build          | Maven (Maven Wrapper)                  |
| Utilitários    | Lombok                                 |

## Arquitetura

O projeto segue uma arquitetura em camadas, em que cada camada tem uma responsabilidade:

```
Controller  ->  Service  ->  Repository  ->  Banco (MySQL)
    |              |
   DTO          Entity
    |
  Mapper
```

```
src/main/java/com/emertag/emertagAPP
├── config        # SecurityConfig (CORS, rotas públicas, PasswordEncoder)
├── controller    # Endpoints REST (camada fina, só orquestra)
├── dtos          # Objetos de entrada e saída da API
├── entity        # Entidades JPA, espelho das tabelas
├── enums         # TipoPerfil, TipoInformacaoSaude, TamanhoTexto, StatusConvite
├── exception     # GlobalExceptionHandler (@RestControllerAdvice)
├── mapper        # Conversão entre Entity e DTO
├── repository    # Interfaces Spring Data JPA
├── security      # JwtService e JwtAuthFilter
└── service       # Regras de negócio
```

Decisões de projeto:

- **DTOs sempre**: entidades nunca são expostas diretamente (evita vazar `senhaHash` e problemas de serialização com relacionamentos `LAZY`).
- **`AutorizacaoPerfilService`** centraliza as regras de permissão (administrador, edição, visualização) e evita dependência circular entre services.
- **Regras de negócio nos services**, não nos controllers nem nas entidades.
- **Schema versionado com Flyway** e validado pelo Hibernate (`ddl-auto: validate`).

## Modelo de dados

Oito tabelas, criadas pelas migrations em `src/main/resources/db/migration`:

| Tabela                        | Descrição                                                                   |
| ----------------------------- | --------------------------------------------------------------------------- |
| `usuario`                     | Conta do usuário (nome, e-mail, senha com hash, foto)                       |
| `configuracao_acessibilidade` | Preferências de acessibilidade (relação 0..1 com usuário)                   |
| `perfil_emergencia`           | Perfil protegido, com `token_publico` único usado no QR Code                |
| `informacao_saude`            | Uma linha por item de saúde (tipo + descrição)                              |
| `privacidade_perfil`          | Flags `exibir_*` que controlam a página pública                             |
| `contato_emergencia`          | Contatos de emergência do perfil                                            |
| `rede_cuidado`                | Vínculo cuidador e perfil, com permissões; `UNIQUE (id_perfil, id_usuario)` |
| `convite_rede`                | Convites por e-mail (`PENDENTE`, `ACEITO`, `RECUSADO`, `CANCELADO`)         |

## Como executar

### Pré-requisitos

- JDK 21
- MySQL 8 em execução
- (Opcional) Postman, para testar os endpoints

### Passo a passo

**1. Clone o repositório**

```bash
git clone <url-do-repositorio>
cd emertagAPP
```

**2. Crie o banco de dados** (o Flyway cria as tabelas, mas não o banco)

```sql
CREATE DATABASE emertagbd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**3. Defina as variáveis de ambiente** (veja a [tabela abaixo](#variáveis-de-ambiente)). No PowerShell, para a sessão atual:

```powershell
$env:DB_PASSWORD = "sua_senha_do_mysql"
$env:JWT_SECRET  = "uma-chave-longa-e-aleatoria-com-pelo-menos-32-caracteres"
```

**4. Suba a aplicação**

```powershell
.\mvnw.cmd spring-boot:run
```

No Linux ou macOS: `./mvnw spring-boot:run`.

A API fica disponível em `http://localhost:8080`. Na primeira execução, o Flyway aplica as migrations automaticamente.

> Se aparecer `Port 8080 was already in use`, há outra instância da aplicação rodando. Encerre-a antes de subir de novo.

## Variáveis de ambiente

Todas têm valor padrão para desenvolvimento local, mas **em qualquer ambiente fora da sua máquina, defina pelo menos `DB_PASSWORD` e `JWT_SECRET`**.

| Variável       | Padrão                                        | Descrição                                         |
| -------------- | --------------------------------------------- | ------------------------------------------------- |
| `BD_URL`       | `jdbc:mysql://localhost:3306/emertagbd?...`   | URL JDBC do banco                                 |
| `DB_USERNAME`  | `root`                                        | Usuário do banco                                  |
| `DB_PASSWORD`  | `root`                                        | Senha do banco                                    |
| `JWT_SECRET`   | chave de exemplo                              | Chave de assinatura do JWT (mínimo 32 caracteres) |
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Origens permitidas, separadas por vírgula         |

Outras propriedades (`application.yaml`): `jwt.expiration-ms` (padrão `86400000`, ou seja, 24 horas).

## Autenticação

A API é **stateless** e usa **JWT**.

1. Cadastre-se em `POST /usuarios`.
2. Faça login em `POST /usuarios/login` e copie o `token` da resposta.
3. Envie o token nas demais requisições:
   ```
   Authorization: Bearer <token>
   ```

**Rotas públicas** (não exigem token): `POST /usuarios`, `POST /usuarios/login` e `GET /perfis/publico/**`. Todas as outras exigem autenticação.

## Endpoints

### Usuários

| Método | Rota              | Descrição                      |
| ------ | ----------------- | ------------------------------ |
| `POST` | `/usuarios`       | Cadastra um usuário            |
| `POST` | `/usuarios/login` | Autentica e devolve o JWT      |
| `GET`  | `/usuarios/me`    | Dados do usuário autenticado   |
| `PUT`  | `/usuarios/me`    | Atualiza nome, telefone e foto |

### Acessibilidade

| Método | Rota                           | Descrição                                              |
| ------ | ------------------------------ | ------------------------------------------------------ |
| `GET`  | `/configuracao-acessibilidade` | Busca a configuração (devolve o padrão se não existir) |
| `PUT`  | `/configuracao-acessibilidade` | Cria ou atualiza a configuração                        |

### Perfis de emergência

| Método | Rota                           | Descrição                                                |
| ------ | ------------------------------ | -------------------------------------------------------- |
| `POST` | `/perfis`                      | Cria um perfil                                           |
| `GET`  | `/perfis`                      | Lista os perfis que o usuário administra                 |
| `PUT`  | `/perfis/{id}`                 | Atualiza o perfil (somente administrador)                |
| `POST` | `/perfis/{id}/regenerar-token` | Gera um novo token, invalidando o QR Code anterior       |
| `GET`  | `/perfis/publico/{token}`      | **Público.** Perfil filtrado pelas regras de privacidade |

### Informações de saúde

| Método   | Rota                                      | Descrição               |
| -------- | ----------------------------------------- | ----------------------- |
| `GET`    | `/perfis/{idPerfil}/saude`                | Lista agrupada por tipo |
| `POST`   | `/perfis/{idPerfil}/saude`                | Adiciona um item        |
| `DELETE` | `/perfis/{idPerfil}/saude/{idInformacao}` | Remove um item          |

### Contatos de emergência

| Método   | Rota                                      | Descrição           |
| -------- | ----------------------------------------- | ------------------- |
| `GET`    | `/perfis/{idPerfil}/contatos`             | Lista os contatos   |
| `POST`   | `/perfis/{idPerfil}/contatos`             | Adiciona um contato |
| `PUT`    | `/perfis/{idPerfil}/contatos/{idContato}` | Atualiza um contato |
| `DELETE` | `/perfis/{idPerfil}/contatos/{idContato}` | Remove um contato   |

### Privacidade

| Método | Rota                             | Descrição                |
| ------ | -------------------------------- | ------------------------ |
| `GET`  | `/perfis/{idPerfil}/privacidade` | Consulta as preferências |
| `PUT`  | `/perfis/{idPerfil}/privacidade` | Atualiza as preferências |

### Rede de cuidado e convites

| Método   | Rota                                        | Descrição                                                   |
| -------- | ------------------------------------------- | ----------------------------------------------------------- |
| `GET`    | `/perfis/{idPerfil}/cuidadores`             | Lista os cuidadores do perfil                               |
| `PUT`    | `/perfis/{idPerfil}/cuidadores/{idUsuario}` | Atualiza permissões (`?podeVisualizarPrivado=&podeEditar=`) |
| `DELETE` | `/perfis/{idPerfil}/cuidadores/{idUsuario}` | Remove um cuidador                                          |
| `GET`    | `/minha-rede`                               | Perfis de que o usuário é cuidador                          |
| `POST`   | `/perfis/{idPerfil}/convites`               | Convida alguém por e-mail                                   |
| `GET`    | `/perfis/{idPerfil}/convites`               | Lista convites pendentes do perfil                          |
| `DELETE` | `/perfis/{idPerfil}/convites/{idConvite}`   | Cancela um convite                                          |
| `GET`    | `/meus-convites`                            | Convites pendentes para o e-mail do usuário                 |
| `POST`   | `/convites/{idConvite}/aceitar`             | Aceita um convite                                           |
| `POST`   | `/convites/{idConvite}/recusar`             | Recusa um convite                                           |

### Exemplo rápido

```http
POST /usuarios
Content-Type: application/json

{
  "nome": "Maria Silva",
  "email": "maria@teste.com",
  "senha": "senha12345"
}
```

```http
POST /perfis
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "José Oliveira",
  "dataNascimento": "1950-03-12",
  "tipoSanguineo": "O+",
  "tipoPerfil": "PROTEGIDO",
  "parentesco": "Pai"
}
```

## Tratamento de erros

O `GlobalExceptionHandler` converte exceções em respostas HTTP:

| Situação                                  | Status            | Corpo                          |
| ----------------------------------------- | ----------------- | ------------------------------ |
| Dado inválido ou regra de negócio violada | `400 Bad Request` | `{ "erro": "mensagem" }`       |
| Falha na validação de campos              | `400 Bad Request` | `{ "campo": "mensagem", ... }` |
| Sem permissão para a ação                 | `403 Forbidden`   | `{ "erro": "mensagem" }`       |
| Rota protegida sem token válido           | `403 Forbidden`   | -                              |

## Segurança

- Senhas armazenadas com **BCrypt**; a API nunca devolve `senhaHash`.
- A mensagem de login inválido é **a mesma** para e-mail inexistente e senha errada, para não revelar quais e-mails têm conta.
- O token público é **aleatório e não sequencial** (UUID truncado, com checagem de colisão).
- A página pública só exibe o que o administrador liberou em `privacidade_perfil`, e não expõe o ID interno do perfil nem o token.
- Ações de edição validam, no service, se o solicitante é administrador (ou cuidador com permissão).
- **Nunca versione segredos.** Use variáveis de ambiente para `DB_PASSWORD` e `JWT_SECRET`.

## Roadmap

- [x] Entidades, migrations e repositories
- [x] Services com regras de negócio
- [x] DTOs e mappers
- [x] Autenticação JWT
- [x] Controllers
- [x] CORS
- [x] `GET /perfis/{id}` (buscar um perfil específico)
- [x] URL pública do QR Code configurável (`app.url-publica`), hoje fixa no mapper
- [x] Documentação interativa com Swagger/OpenAPI
- [x] Upload de foto (hoje `fotoUrl` é apenas uma URL)
- [x] Refresh token
- [x] Envio de e-mail para os convites

## Autores

Projeto EmerTag - desenvolvido para fins acadêmicos.

- Maxwell Cadete
-
