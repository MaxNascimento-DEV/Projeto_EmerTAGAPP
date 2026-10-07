CREATE TABLE privacidade_perfil(
    id_privacidade BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perfil BIGINT NOT NULL UNIQUE,
    exibir_alergias BOOLEAN NOT NULL DEFAULT TRUE,
    exibir_condicoes BOOLEAN NOT NULL DEFAULT TRUE,
    exibir_medicamentos BOOLEAN NOT NULL DEFAULT TRUE,
    exibir_necessidades BOOLEAN NOT NULL DEFAULT TRUE,
    exibir_biosseguranca BOOLEAN NOT NULL DEFAULT TRUE, 
    exibir_idade BOOLEAN NOT NULL DEFAULT TRUE,
    exibir_tipo_sanguineo BOOLEAN NOT NULL DEFAULT TRUE, 
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME, 
    CONSTRAINT fk_privacidade_perfil_emergencia FOREIGN KEY (id_perfil) REFERENCES perfil_emergencia(id_perfil)
)