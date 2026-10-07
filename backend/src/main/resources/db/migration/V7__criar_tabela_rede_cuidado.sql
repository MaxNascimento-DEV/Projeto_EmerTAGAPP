CREATE TABLE rede_cuidado (
    id_rede BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perfil BIGINT NOT NULL,
    id_usuario BIGINT NOT NULL,
    pode_visualizar_privado BOOLEAN NOT NULL,
    pode_editar BOOLEAN NOT NULL,
    criado_em DATETIME NOT NULL,
    CONSTRAINT uk_rede_cuidado_perfil_usuario UNIQUE (id_perfil, id_usuario),
    CONSTRAINT fk_rede_cuidado_perfil FOREIGN KEY (id_perfil) REFERENCES perfil_emergencia (id_perfil),
    CONSTRAINT fk_rede_cuidado_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
)