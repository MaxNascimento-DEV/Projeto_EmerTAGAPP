CREATE TABLE contato_emergencia(
    id_contato BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perfil BIGINT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    relacao VARCHAR(50) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME, 
    CONSTRAINT fk_contato_emergencia_perfil FOREIGN KEY (id_perfil) REFERENCES perfil_emergencia(id_perfil)  
)