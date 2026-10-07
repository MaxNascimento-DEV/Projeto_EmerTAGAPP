CREATE TABLE perfil_emergencia(
    id_perfil BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_administrador BIGINT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL,
    tipo_sanguineo VARCHAR(3),
    foto_url VARCHAR(500),
    tipo_perfil VARCHAR(15) NOT NULL, 
    parentesco VARCHAR(50), 
    token_publico VARCHAR(100) NOT NULL UNIQUE,
    ultima_atualizacao_saude DATETIME,
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME, 
    CONSTRAINT fk_perfil_emergencia_usuario FOREIGN KEY (id_administrador) REFERENCES usuario(id_usuario)
)