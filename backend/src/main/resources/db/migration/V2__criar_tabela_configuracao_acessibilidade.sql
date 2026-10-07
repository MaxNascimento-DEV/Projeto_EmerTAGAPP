CREATE TABLE configuracao_acessibilidade (
    id_configuracao BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL UNIQUE,
    tamanho_texto VARCHAR(10),
    alto_contraste BOOLEAN,
    criado_em DATETIME NOT NULL, 
    atualizado_em DATETIME,
    CONSTRAINT fk_configuracao_acessibilidade_usuario FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario)
)