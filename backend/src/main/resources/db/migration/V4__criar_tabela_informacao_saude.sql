CREATE TABLE informacao_saude(
    id_informacao BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perfil BIGINT NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME,
    CONSTRAINT fk_informacao_saude_perfil FOREIGN KEY (id_perfil) REFERENCES perfil_emergencia(id_perfil)
)