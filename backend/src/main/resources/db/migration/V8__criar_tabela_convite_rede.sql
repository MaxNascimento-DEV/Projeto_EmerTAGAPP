CREATE TABLE convite_rede(
    id_convite BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perfil BIGINT NOT NULL,
    email_convidado VARCHAR(150) NOT NULL,
    pode_visualizar_privado BOOLEAN NOT NULL,
    pode_editar BOOLEAN NOT NULL, 
    status VARCHAR(15) NOT NULL, 
    criado_em DATETIME NOT NULL,
    respondido_em DATETIME,
    CONSTRAINT fk_convite_rede_perfil FOREIGN KEY (id_perfil) REFERENCES perfil_emergencia(id_perfil)
)