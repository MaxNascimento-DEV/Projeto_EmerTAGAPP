# EmerTag

Aplicativo de identificação de emergência: o usuário cadastra perfis com informações de saúde, contatos de emergência e rede de cuidado, e cada perfil gera um QR Code que abre uma página pública com os dados liberados para socorristas.

## Estrutura do repositório

```
EmerTag_APP/
├── backend/   # API REST em Spring Boot (Java 21, MySQL, Flyway, JWT)
└── mobile/    # App em React Native com Expo (TypeScript)
```

## Backend

Pré-requisitos: Java 21 e MySQL com o banco `emertagbd` criado.

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

A API sobe em `http://localhost:8080`. As migrations ficam em `backend/src/main/resources/db/migration` e rodam automaticamente pelo Flyway.

Variáveis de ambiente (todas opcionais em desenvolvimento):

| Variável          | Padrão                                      | Uso                                       |
| ----------------- | ------------------------------------------- | ----------------------------------------- |
| `BD_URL`          | `jdbc:mysql://localhost:3306/emertagbd?...` | URL do banco                              |
| `DB_USERNAME`     | `root`                                      | Usuário do banco                          |
| `DB_PASSWORD`     | `root`                                      | Senha do banco                            |
| `JWT_SECRET`      | chave de desenvolvimento                    | Assinatura dos tokens (troque em produção) |
| `APP_URL_PUBLICA` | vazio                                       | Domínio fixo gravado no QR Code           |
| `APP_UPLOADS_DIR` | `uploads`                                   | Pasta das fotos enviadas pelo app         |

## Mobile

Pré-requisitos: Node.js e o app Expo Go no celular (ou um emulador Android).

```bash
cd mobile
npm install
cp .env.example .env          # ajuste EXPO_PUBLIC_API_URL com o IP da máquina que roda o backend
npm start
```
