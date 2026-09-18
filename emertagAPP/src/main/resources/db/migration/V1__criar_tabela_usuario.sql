CREATE TABLE usuario(
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE, 
    telefone VARCHAR(20), 
    senha_hash VARCHAR(255) NOT NULL, 
    foto_url VARCHAR(500), 
    criado_em DATETIME NOT NULL, 
    atualizado_em DATETIME
)